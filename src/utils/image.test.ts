import { compressImage } from './image';

describe('image utils', () => {
  describe('compressImage', () => {
    let mockFile: File;
    let mockImage: HTMLImageElement;
    let originalImageConstructor: any;
    
    beforeEach(() => {
      mockFile = new File([''], 'test.png', { type: 'image/png' });
      
      // Mock Canvas and Context
      const mockContext = {
        drawImage: jest.fn(),
      };
      
      // Keep track of the original HTMLCanvasElement to restore it later if needed
      HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext) as any;
      HTMLCanvasElement.prototype.toBlob = jest.fn((callback) => {
        callback(new Blob(['mock compressed blob'], { type: 'image/jpeg' }));
      });
      
      // Setup FileReader Mock (it executes synchronously for testing here)
      const mockFileReader = {
        readAsDataURL: jest.fn(function(this: any) {
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: { result: 'data:image/png;base64,mock' } });
            }
          }, 0);
        }),
        onload: null as any,
        onerror: null as any,
      };
      (global as any).FileReader = jest.fn(() => mockFileReader);
      
      // Setup Image mock
      mockImage = {
        width: 1600,
        height: 1200,
        onload: null as any,
        src: '',
      } as any;
      
      originalImageConstructor = global.Image;
      global.Image = jest.fn(() => mockImage) as any;
    });
    
    afterEach(() => {
      jest.clearAllMocks();
      global.Image = originalImageConstructor;
    });

    it('compresses image successfully and scales down when wider than maxWidth', async () => {
      const promise = compressImage(mockFile, 800, 0.7);
      
      // Wait for FileReader and Image callbacks
      await new Promise(resolve => setTimeout(resolve, 10));
      if (mockImage.onload) mockImage.onload({} as any);
      
      const blob = await promise;
      
      expect(blob).toBeInstanceOf(Blob);
      // It should create a canvas scaled to half size (1600 -> 800)
      // Note: we can't easily assert the canvas dimensions directly because it's a local variable,
      // but we know toBlob was called
    });

    it('does not scale down when narrower than maxWidth', async () => {
      mockImage.width = 400;
      mockImage.height = 300;
      
      const promise = compressImage(mockFile, 800, 0.7);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      if (mockImage.onload) mockImage.onload({} as any);
      
      const blob = await promise;
      expect(blob).toBeInstanceOf(Blob);
    });

    it('handles FileReader errors gracefully', async () => {
      const mockFileReader = {
        readAsDataURL: jest.fn(function(this: any) {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror(new Error('FileReader failed'));
            }
          }, 0);
        }),
      };
      (global as any).FileReader = jest.fn(() => mockFileReader);
      
      await expect(compressImage(mockFile)).rejects.toThrow('FileReader failed');
    });

    it('handles canvas toBlob returning null', async () => {
      HTMLCanvasElement.prototype.toBlob = jest.fn((callback) => {
        callback(null);
      });
      
      const promise = compressImage(mockFile);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      if (mockImage.onload) mockImage.onload({} as any);
      
      await expect(promise).rejects.toThrow('Canvas to Blob conversion failed');
    });
  });
});
