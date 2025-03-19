// Third party plugins
import Swal from "sweetalert2";

// JsPsych type
import { JsPsych } from "jspsych";

interface BlurTracker {
  TRACK: boolean;
  MAX_BLUR: number;
  nBLUR: number;
}

/**
 * Interface for storing messages in multiple languages
 */
interface LanguageMessages {
  warningTitle: string;
  warningText: (blurCount: number, remainingBlurs: number) => string;
  errorTitle: string;
  errorText: string;
}

/**
 * Interface for managing multi-language messages
 */
interface LanguageConfig {
  currentLanguage: string;
  messages: Record<string, LanguageMessages>;
}

// Default language messages
const defaultLanguages: Record<string, LanguageMessages> = {
  en: {
    warningTitle: "Warning",
    warningText: (blurCount: number, remainingBlurs: number) =>
      `You have left the window tab ${blurCount} time(s). ` +
      `If you leave ${remainingBlurs} more time${
        remainingBlurs !== 1 ? "s" : ""
      }, ` +
      `you will be exited from the study.`,
    errorTitle: "Study Terminated",
    errorText:
      "Unfortunately, you have left the tab/browser window more than the allowed number of times. " +
      "As stated in the instructions, we need to end this experiment prematurely.",
  },
  zh: {
    warningTitle: "警告",
    warningText: (blurCount: number, remainingBlurs: number) =>
      `您已离开实验页面 ${blurCount} 次。` +
      `如果您再离开 ${remainingBlurs} 次，` +
      `您将被退出本研究。`,
    errorTitle: "研究已终止",
    errorText:
      "很遗憾，您离开浏览器标签/窗口的次数已超过允许的次数。" +
      "正如实验开始时所述，我们必须提前结束本实验。",
  },
  de: {
    warningTitle: "Warnung",
    warningText: (blurCount: number, remainingBlurs: number) =>
      `Sie haben das Fenster ${blurCount} Mal verlassen. ` +
      `Wenn Sie es noch ${remainingBlurs} Mal verlassen, ` +
      `werden Sie aus der Studie ausgeschlossen.`,
    errorTitle: "Studie beendet",
    errorText:
      "Leider haben Sie den Tab/Browserfenster öfter als erlaubt verlassen. " +
      "Wie zu Beginn angekündigt, müssen wir das Experiment vorzeitig beenden.",
  },
};

/**
 * Helper function to detect jsPsych version and end experiment appropriately
 *
 * @param {JsPsych} jsPsych - JsPsych instance
 * @param {string} message - Optional message to display when ending experiment
 */
function endExperimentSafely(jsPsych: JsPsych, message?: string): void {
  // Check if we're using jsPsych v8.x (which uses abortExperiment)
  if (typeof (jsPsych as any).abortExperiment === "function") {
    (jsPsych as any).abortExperiment(message);
  }
  // @ts-ignore Fall back to jsPsych v7.x method
  else if (typeof jsPsych.endExperiment === "function") {
    // @ts-ignore
    jsPsych.endExperiment(message);
  }
  // Last resort if neither method is available
  else {
    console.error(
      "Could not end experiment: compatible jsPsych method not found"
    );
  }
}

/**
 * Tracks browser tab/window focus and controls experiment flow based on blur events
 *
 * This function monitors when a participant leaves the experiment tab/window and
 * can show warnings or end the experiment after a specified number of blur events.
 *
 * @param {BlurTracker} blurTracker - Object tracking blur state
 * @param {boolean} showAlert - Whether to display warning alerts
 * @param {JsPsych} jsPsych - JsPsych instance
 * @param {LanguageConfig} langConfig - Language configuration (optional)
 * @returns {void}
 */
export function trackInteractions(
  blurTracker: BlurTracker,
  showAlert = true,
  jsPsych: JsPsych,
  langConfig?: LanguageConfig
): void {
  if (!blurTracker || !jsPsych) {
    console.error("Invalid parameters provided to trackInteractions");
    return;
  }

  // Skip processing if tracking is disabled
  if (!blurTracker.TRACK) {
    return;
  }

  // Prepare language configuration
  const language = langConfig?.currentLanguage || "en";
  const messages = langConfig?.messages || defaultLanguages;
  const languageMessages =
    messages[language] || messages["en"] || defaultLanguages["en"];

  // Get the last interaction event
  try {
    const interactionData = JSON.parse(
      jsPsych.data.getInteractionData().json()
    );
    if (!interactionData || interactionData.length === 0) {
      return;
    }

    const lastEvent = interactionData[interactionData.length - 1];

    // Process blur events
    if (lastEvent && lastEvent.event === "blur") {
      // Increment blur counter
      blurTracker.nBLUR++;

      const remainingBlurs = blurTracker.MAX_BLUR - blurTracker.nBLUR;

      // Handle case where user still has remaining blurs
      if (blurTracker.nBLUR < blurTracker.MAX_BLUR) {
        if (showAlert) {
          jsPsych.pauseExperiment();

          Swal.fire({
            icon: "warning",
            title: languageMessages.warningTitle,
            text: languageMessages.warningText(
              blurTracker.nBLUR,
              remainingBlurs
            ),
            showConfirmButton: true,
          }).then(() => {
            jsPsych.resumeExperiment();
          });
        }
      }
      // Handle case where user has exceeded max blurs
      else {
        Swal.fire({
          icon: "error",
          title: languageMessages.errorTitle,
          text: languageMessages.errorText,
          showConfirmButton: true,
        }).then(() => {
          // Use version-appropriate method to end the experiment
          endExperimentSafely(jsPsych);
        });
      }
    }
  } catch (error) {
    console.error("Error in trackInteractions:", error);
  }
}

/**
 * Create a custom language configuration with your own translations
 *
 * @param {string} defaultLanguage - The default language code to use
 * @param {Record<string, LanguageMessages>} customMessages - Custom translations
 * @returns {LanguageConfig} Language configuration object
 */
export function createLanguageConfig(
  defaultLanguage: string = "en",
  customMessages: Record<string, Partial<LanguageMessages>> = {}
): LanguageConfig {
  // Merge custom messages with default messages
  const mergedMessages: Record<string, LanguageMessages> = {
    ...defaultLanguages,
  };

  // Add or override with custom messages
  Object.keys(customMessages).forEach((langCode) => {
    if (mergedMessages[langCode]) {
      mergedMessages[langCode] = {
        ...mergedMessages[langCode],
        ...customMessages[langCode],
      };
    } else {
      // If this is a new language and partial implementation, use English as fallback
      mergedMessages[langCode] = {
        ...defaultLanguages["en"],
        ...customMessages[langCode],
      } as LanguageMessages;
    }
  });

  return {
    currentLanguage: defaultLanguage,
    messages: mergedMessages,
  };
}
