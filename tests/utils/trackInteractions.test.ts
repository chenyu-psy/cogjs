import { createLanguageConfig, trackInteractions } from '../../src/utils/trackInteractions';
import Swal from 'sweetalert2';

// Mock dependencies
jest.mock('sweetalert2');

describe('Language configuration', () => {
  test('should create a language config with default settings', () => {
    const config = createLanguageConfig();
    
    expect(config.currentLanguage).toBe('en');
    expect(config.messages.en).toBeDefined();
    expect(config.messages.zh).toBeDefined();
    expect(config.messages.de).toBeDefined();
  });

  test('should override default language', () => {
    const config = createLanguageConfig('zh');
    
    expect(config.currentLanguage).toBe('zh');
  });

  test('should merge custom messages with default messages', () => {
    const customMessages = {
      en: {
        warningTitle: 'Custom Warning',
      },
    };
    
    const config = createLanguageConfig('en', customMessages);
    
    expect(config.messages.en.warningTitle).toBe('Custom Warning');
    expect(config.messages.en.errorTitle).toBe('Study Terminated'); // Default value preserved
  });

  test('should create a new language with English fallback', () => {
    const customMessages = {
      es: {
        warningTitle: 'Advertencia',
      },
    };
    
    const config = createLanguageConfig('es', customMessages);
    
    expect(config.currentLanguage).toBe('es');
    expect(config.messages.es.warningTitle).toBe('Advertencia');
    expect(config.messages.es.errorTitle).toBe('Study Terminated'); // Fallback to English
  });
});

describe('trackInteractions', () => {
  let mockJsPsych: any;
  let blurTracker: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock jsPsych object
    mockJsPsych = {
      data: {
        getInteractionData: jest.fn().mockReturnValue({
          json: () => JSON.stringify([{ event: 'blur' }])
        })
      },
      pauseExperiment: jest.fn(),
      resumeExperiment: jest.fn(),
      abortExperiment: jest.fn()
    };
    
    // Mock SweetAlert
    (Swal.fire as jest.Mock).mockReturnValue(Promise.resolve());
    
    // Set up blur tracker
    blurTracker = {
      TRACK: true,
      MAX_BLUR: 3,
      nBLUR: 0
    };
  });
  
  test('should do nothing if tracking is disabled', () => {
    blurTracker.TRACK = false;
    trackInteractions(blurTracker, true, mockJsPsych);
    
    expect(mockJsPsych.data.getInteractionData).not.toHaveBeenCalled();
  });
  
  test('should increment blur counter on blur event', () => {
    trackInteractions(blurTracker, true, mockJsPsych);
    
    expect(blurTracker.nBLUR).toBe(1);
  });
  
  test('should show warning when blur count is below max', () => {
    trackInteractions(blurTracker, true, mockJsPsych);
    
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'warning',
      title: 'Warning'
    }));
    expect(mockJsPsych.pauseExperiment).toHaveBeenCalled();
  });
  
  test('should show error and end experiment when max blurs reached', () => {
    blurTracker.nBLUR = 2; // One away from max
    trackInteractions(blurTracker, true, mockJsPsych);
    
    expect(blurTracker.nBLUR).toBe(3);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: 'error',
      title: 'Study Terminated'
    }));
  });
  
  test('should use custom language messages', () => {
    const langConfig = createLanguageConfig('zh');
    trackInteractions(blurTracker, true, mockJsPsych, langConfig);
    
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      title: '警告'
    }));
  });
});
