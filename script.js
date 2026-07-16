const EVENT_DETAILS = {
  gate: "Gate A",
  section: "Living Room",
  kickoff: "2:00 PM",
  predictionUrl: "https://forms.google.com/",
};

const FAMILY_CUSTOMIZATIONS = {
  "kang family": {
    kicker: "Kang Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify the Kang Family ticket matches the arriving guests.",
    image: {
      src: window.FAMILY_IMAGE_DATA?.kangFamily ?? "",
      alt: "Kang family photo used for match day verification.",
      caption: "Kang Family verification photo",
    },
  },
  "kang's family": {
    kicker: "Kang Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify the Kang Family ticket matches the arriving guests.",
    image: {
      src: window.FAMILY_IMAGE_DATA?.kangFamily ?? "",
      alt: "Kang family photo used for match day verification.",
      caption: "Kang Family verification photo",
    },
  },
  "cha family": {
    kicker: "Cha Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify the Cha Family ticket matches the arriving guests.",
    image: {
      src: window.FAMILY_IMAGE_DATA?.chaFamily ?? "",
      alt: "Cha family photo used for match day verification.",
      caption: "Cha Family verification photo",
    },
  },
  "daniel moon": {
    kicker: "Daniel Moon Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify Daniel Moon's ticket matches the arriving guest.",
    guestCountOverride: "1",
    image: {
      src: window.FAMILY_IMAGE_DATA?.danielMoon ?? "",
      alt: "Daniel Moon photo used for match day verification.",
      caption: "Daniel Moon verification photo",
    },
  },
  "lim family": {
    kicker: "Lim Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify the Lim Family ticket matches the arriving guests.",
    image: {
      src: window.FAMILY_IMAGE_DATA?.limFamily ?? "",
      alt: "Lim family photo used for match day verification.",
      caption: "Lim Family verification photo",
    },
  },
  "kim family": {
    kicker: "Kim Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify the Kim Family ticket matches the arriving guests.",
    guestCountOverride: "2",
    image: {
      src: window.FAMILY_IMAGE_DATA?.kimFamily ?? "",
      alt: "Kim family photo used for match day verification.",
      caption: "Kim Family verification photo",
    },
  },
  "jung family": {
    kicker: "Jung Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this photo after confirmation to verify the Jung Family ticket matches the arriving guests.",
    guestCountOverride: "3",
    image: {
      src: window.FAMILY_IMAGE_DATA?.jungFamily ?? "",
      alt: "Jung family group photo used for match day verification.",
      caption: "Jung Family verification photo",
    },
  },
  "zhang family": {
    kicker: "Zhang Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this updated photo after confirmation to verify the full Zhang Family ticket.",
    image: {
      src: window.FAMILY_IMAGE_DATA?.zhangFamily ?? "",
      alt: "Updated Zhang family verification photo with all family members.",
      caption: "Zhang Family verification photo",
    },
  },
  "zhang's family": {
    kicker: "Zhang Family Verification",
    title: "Family Photo Check",
    copy:
      "Use this updated photo after confirmation to verify the full Zhang Family ticket.",
    image: {
      src: window.FAMILY_IMAGE_DATA?.zhangFamily ?? "",
      alt: "Updated Zhang family verification photo with all family members.",
      caption: "Zhang Family verification photo",
    },
  },
};

const state = {
  audioContext: null,
  confirmationTimerId: null,
  confettiFrameId: null,
  currentTicketData: null,
  soundEnabled: true,
  hasConfirmed: false,
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches,
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  const ticketData = getTicketDataFromURL();
  applyTicketData(ticketData);
  bindEvents();

  if (ticketData.isStandbyMode) {
    showStandbyScreen();
    return;
  }

  startCheckInAnimation();
});

function cacheElements() {
  elements.ticketCard = document.querySelector(".ticket-card");
  elements.familyName = document.getElementById("family-name");
  elements.ticketNumber = document.getElementById("ticket-number");
  elements.guestCount = document.getElementById("guest-count");
  elements.gateName = document.getElementById("gate-name");
  elements.sectionName = document.getElementById("section-name");
  elements.kickoffTime = document.getElementById("kickoff-time");
  elements.ticketCaption = document.getElementById("ticket-caption");
  elements.checkmarkBadge = document.querySelector(".checkmark-badge");
  elements.confirmationPhotoImage = document.getElementById("confirmation-photo-image");
  elements.confirmationWidePhotoPanel = document.getElementById("confirmation-wide-photo-panel");
  elements.confirmationWidePhotoImage = document.getElementById("confirmation-wide-photo-image");
  elements.confirmationWidePhotoCaption = document.getElementById("confirmation-wide-photo-caption");
  elements.scanLabel = document.getElementById("scan-label");
  elements.scanHint = document.getElementById("scan-hint");
  elements.manualConfirmCopy = document.getElementById("manual-confirm-copy");
  elements.manualConfirmButton = document.getElementById("manual-confirm-button");
  elements.nextGuestButton = document.getElementById("next-guest-button");
  elements.readyMessage = document.getElementById("ready-message");
  elements.soundToggle = document.getElementById("sound-toggle");
  elements.statusLive = document.getElementById("status-live");
  elements.confettiCanvas = document.getElementById("confetti-canvas");
}

function getTicketDataFromURL() {
  const params = new URLSearchParams(window.location.search);
  const familyName = sanitizeDisplayValue(
    params.get("family"),
    "Guest Family",
    48,
  );
  const ticketNumber = sanitizeDisplayValue(
    params.get("ticket"),
    "General Admission",
    24,
  );
  const guestCount = sanitizeGuestCount(params.get("guests"));
  const familyKey = familyName.toLowerCase();
  const customization = FAMILY_CUSTOMIZATIONS[familyKey];

  return {
    familyName,
    familyDisplayName: familyName.toUpperCase(),
    familyKey,
    ticketNumber,
    guestCount: customization?.guestCountOverride ?? guestCount,
    gate: EVENT_DETAILS.gate,
    section: EVENT_DETAILS.section,
    kickoff: EVENT_DETAILS.kickoff,
    isStandbyMode: !params.has("family") && !params.has("ticket") && !params.has("guests"),
  };
}

function sanitizeDisplayValue(value, fallbackValue, maxLength = 60) {
  if (typeof value !== "string") {
    return fallbackValue;
  }

  const collapsedValue = value
    .replace(/[\u0000-\u001f\u007f<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!collapsedValue) {
    return fallbackValue;
  }

  return collapsedValue.slice(0, maxLength);
}

function sanitizeGuestCount(value) {
  const parsedGuestCount = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsedGuestCount) || parsedGuestCount < 1 || parsedGuestCount > 99) {
    return "Not listed";
  }

  return String(parsedGuestCount);
}

function applyTicketData(ticketData) {
  state.currentTicketData = ticketData;
  elements.familyName.textContent = ticketData.familyDisplayName;
  elements.ticketNumber.textContent = ticketData.ticketNumber;
  elements.guestCount.textContent = ticketData.guestCount;
  elements.gateName.textContent = ticketData.gate;
  elements.sectionName.textContent = ticketData.section;
  elements.kickoffTime.textContent = ticketData.kickoff;
  elements.ticketCaption.textContent = `Ticket No. ${ticketData.ticketNumber} is ready at ${ticketData.gate}.`;
  renderFamilyCustomization(ticketData.familyKey);

  document.title = `${ticketData.familyName} | World Cup Watch Party Check-In`;
}

function showStandbyScreen() {
  window.clearTimeout(state.confirmationTimerId);
  stopConfetti();
  state.hasConfirmed = false;

  elements.ticketCard.classList.remove("is-confirmed");
  elements.ticketCard.classList.remove("has-wide-photo");
  elements.checkmarkBadge.classList.remove("has-family-photo");
  elements.confirmationPhotoImage.hidden = true;
  elements.confirmationPhotoImage.removeAttribute("src");
  elements.confirmationPhotoImage.alt = "";
  elements.confirmationWidePhotoPanel.hidden = true;
  elements.confirmationWidePhotoImage.removeAttribute("src");
  elements.confirmationWidePhotoImage.alt = "";
  elements.manualConfirmCopy.hidden = true;
  elements.manualConfirmButton.hidden = true;
  elements.nextGuestButton.hidden = true;
  elements.readyMessage.hidden = false;
  elements.readyMessage.textContent =
    "Ready to scan the next family ticket.";
  elements.familyName.textContent = "READY TO SCAN";
  elements.ticketCaption.textContent =
    "Open the phone camera, scan the next QR ticket, and enjoy the World Cup Final match.";
  elements.ticketNumber.textContent = "Waiting For Scan";
  elements.guestCount.textContent = "Will appear after scan";
  elements.scanLabel.textContent = "Scan the next QR ticket";
  elements.scanHint.textContent =
    "Use the phone camera to open the next family check-in page.";
  elements.statusLive.textContent = "Standby mode. Ready to scan the next ticket.";
}

function renderFamilyCustomization(familyKey) {
  const customization = FAMILY_CUSTOMIZATIONS[familyKey];

  if (!customization) {
    elements.ticketCard.classList.remove("has-wide-photo");
    elements.checkmarkBadge.classList.remove("has-family-photo");
    elements.confirmationPhotoImage.hidden = true;
    elements.confirmationPhotoImage.removeAttribute("src");
    elements.confirmationPhotoImage.alt = "";
    elements.confirmationWidePhotoPanel.hidden = true;
    elements.confirmationWidePhotoImage.removeAttribute("src");
    elements.confirmationWidePhotoImage.alt = "";
    return;
  }

  if (customization.image) {
    elements.ticketCard.classList.remove("has-wide-photo");
    elements.checkmarkBadge.classList.add("has-family-photo");
    elements.confirmationPhotoImage.src = customization.image.src;
    elements.confirmationPhotoImage.alt = customization.image.alt;
    elements.confirmationPhotoImage.hidden = false;
  } else {
    elements.checkmarkBadge.classList.remove("has-family-photo");
    elements.confirmationPhotoImage.hidden = true;
    elements.confirmationPhotoImage.removeAttribute("src");
    elements.confirmationPhotoImage.alt = "";
  }

  if (customization.wideImage) {
    elements.ticketCard.classList.add("has-wide-photo");
    elements.checkmarkBadge.classList.remove("has-family-photo");
    elements.confirmationPhotoImage.hidden = true;
    elements.confirmationPhotoImage.removeAttribute("src");
    elements.confirmationPhotoImage.alt = "";
    elements.confirmationWidePhotoImage.src = customization.wideImage.src;
    elements.confirmationWidePhotoImage.alt = customization.wideImage.alt;
    elements.confirmationWidePhotoCaption.textContent = customization.wideImage.caption;
    elements.confirmationWidePhotoPanel.hidden = false;
  } else {
    elements.ticketCard.classList.remove("has-wide-photo");
    elements.confirmationWidePhotoPanel.hidden = true;
    elements.confirmationWidePhotoImage.removeAttribute("src");
    elements.confirmationWidePhotoImage.alt = "";
  }
}

function bindEvents() {
  elements.manualConfirmButton.addEventListener("click", async () => {
    elements.manualConfirmButton.disabled = true;

    try {
      await completeCheckIn({ requireUserGesture: true });
    } finally {
      elements.manualConfirmButton.disabled = false;
    }
  });

  elements.nextGuestButton.addEventListener("click", returnToScannerOrReset);
  elements.soundToggle.addEventListener("click", toggleSound);
}

function startCheckInAnimation() {
  window.clearTimeout(state.confirmationTimerId);
  stopConfetti();
  state.hasConfirmed = false;

  elements.ticketCard.classList.remove("is-confirmed");
  elements.manualConfirmCopy.hidden = true;
  elements.manualConfirmButton.hidden = true;
  elements.nextGuestButton.hidden = true;
  elements.readyMessage.hidden = true;
  elements.scanLabel.textContent = state.prefersReducedMotion
    ? "Ticket ready to confirm"
    : "Verifying ticket...";
  elements.scanHint.textContent = state.prefersReducedMotion
    ? "Reduced motion is on, so confirmation will appear without animation."
    : "Hold steady while entry is confirmed.";
  elements.statusLive.textContent = "Verifying ticket.";

  if (state.prefersReducedMotion) {
    void completeCheckIn({ requireUserGesture: false, skipDelay: true });
    return;
  }

  state.confirmationTimerId = window.setTimeout(() => {
    void completeCheckIn({ requireUserGesture: false });
  }, 1000);
}

async function completeCheckIn({
  requireUserGesture = false,
  skipDelay = false,
} = {}) {
  if (state.hasConfirmed) {
    return;
  }

  if (state.soundEnabled) {
    try {
      await playConfirmationSound({ requireUserGesture });
    } catch (error) {
      if (!requireUserGesture) {
        showManualConfirmationFallback();
        return;
      }
    }
  }

  showConfirmation({ skipDelay });
}

function showManualConfirmationFallback() {
  window.clearTimeout(state.confirmationTimerId);
  elements.scanLabel.textContent = "Confirmation ready";
  elements.scanHint.textContent =
    "Your browser is waiting for a tap before it can play sound.";
  elements.manualConfirmCopy.hidden = false;
  elements.manualConfirmButton.hidden = false;
  elements.statusLive.textContent =
    "Tap to confirm entry and play the confirmation sound.";
}

function showConfirmation({ skipDelay = false } = {}) {
  state.hasConfirmed = true;
  elements.ticketCard.classList.add("is-confirmed");
  elements.manualConfirmCopy.hidden = true;
  elements.manualConfirmButton.hidden = true;
  elements.nextGuestButton.hidden = false;
  elements.scanLabel.textContent = "Check-in complete";
  elements.scanHint.textContent = "Enjoy the match.";
  elements.statusLive.textContent = "Entry confirmed.";

  if (!state.prefersReducedMotion && !skipDelay) {
    launchConfetti();
  }
}

function launchConfetti() {
  const canvas = elements.confettiCanvas;
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  stopConfetti();

  const devicePixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  const colors = ["#0fd27a", "#ffffff", "#ffd46b", "#6fd7ff"];
  const particles = Array.from({ length: 72 }, () => ({
    x: width * (0.15 + Math.random() * 0.7),
    y: -20 - Math.random() * 80,
    radius: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    velocityX: -2 + Math.random() * 4,
    velocityY: 2.5 + Math.random() * 4,
    rotation: Math.random() * Math.PI,
    rotationVelocity: -0.25 + Math.random() * 0.5,
    gravity: 0.08 + Math.random() * 0.06,
  }));

  const startTime = performance.now();
  const duration = 1500;

  const renderFrame = (currentTime) => {
    const elapsed = currentTime - startTime;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += particle.gravity;
      particle.rotation += particle.rotationVelocity;

      context.save();
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(
        -particle.radius,
        -particle.radius * 0.6,
        particle.radius * 2,
        particle.radius * 1.2,
      );
      context.restore();
    });

    if (elapsed < duration) {
      state.confettiFrameId = window.requestAnimationFrame(renderFrame);
      return;
    }

    stopConfetti();
  };

  state.confettiFrameId = window.requestAnimationFrame(renderFrame);
}

async function playConfirmationSound({ requireUserGesture = false } = {}) {
  const spokenAnnouncement = buildConfirmationAnnouncement();

  if (spokenAnnouncement && canUseSpeechSynthesis()) {
    await speakConfirmationAnnouncement(spokenAnnouncement);
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!state.audioContext) {
    state.audioContext = new AudioContextClass();
  }

  if (state.audioContext.state !== "running") {
    if (!requireUserGesture) {
      throw new Error("Audio playback requires a user gesture.");
    }

    await resumeAudioContext(state.audioContext);
  }

  if (state.audioContext.state !== "running") {
    throw new Error("Audio context could not be resumed.");
  }

  const audioContext = state.audioContext;
  const currentTime = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(784, currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1046, currentTime + 0.16);

  gainNode.gain.setValueAtTime(0.0001, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.08, currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.28);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(currentTime);
  oscillator.stop(currentTime + 0.3);

  await wait(180);
}

function buildConfirmationAnnouncement() {
  const ticketData = state.currentTicketData;

  if (!ticketData) {
    return "Ticket confirmed. Please enjoy the game.";
  }

  return `${ticketData.familyName}, your ticket has been confirmed. Please enjoy the game.`;
}

function canUseSpeechSynthesis() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof window.SpeechSynthesisUtterance === "function"
  );
}

async function speakConfirmationAnnouncement(message) {
  window.speechSynthesis.cancel();

  await new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(message);
    let hasFinished = false;

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      hasFinished = true;
      resolve();
    };

    utterance.onerror = () => {
      hasFinished = true;
      reject(new Error("Speech synthesis could not play the confirmation announcement."));
    };

    window.speechSynthesis.speak(utterance);

    window.setTimeout(() => {
      if (!hasFinished) {
        resolve();
      }
    }, 5000);
  });
}

async function resumeAudioContext(audioContext) {
  const resumePromise = audioContext.resume();

  await Promise.race([
    resumePromise,
    wait(400),
  ]);
}

function resetForNextGuest() {
  window.clearTimeout(state.confirmationTimerId);
  stopConfetti();
  state.hasConfirmed = false;

  elements.ticketCard.classList.remove("is-confirmed");
  elements.manualConfirmCopy.hidden = true;
  elements.manualConfirmButton.hidden = true;
  elements.nextGuestButton.hidden = true;
  elements.readyMessage.hidden = false;
  elements.readyMessage.textContent =
    "Ready for the next guest. Return to the phone camera and scan another QR ticket.";
  elements.scanLabel.textContent = "Scanner standing by";
  elements.scanHint.textContent =
    "Use the phone camera to open the next family ticket.";
  elements.statusLive.textContent = "Ready for the next guest.";
  window.scrollTo({ top: 0, behavior: state.prefersReducedMotion ? "auto" : "smooth" });
}

function returnToScannerOrReset() {
  window.location.href = `${window.location.origin}${window.location.pathname}`;
}

function stopConfetti() {
  if (state.confettiFrameId) {
    window.cancelAnimationFrame(state.confettiFrameId);
    state.confettiFrameId = null;
  }

  const context = elements.confettiCanvas?.getContext("2d");
  if (context) {
    context.clearRect(
      0,
      0,
      elements.confettiCanvas.width,
      elements.confettiCanvas.height,
    );
  }
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  elements.soundToggle.textContent = state.soundEnabled ? "Sound: On" : "Sound: Off";
  elements.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
  elements.statusLive.textContent = state.soundEnabled
    ? "Confirmation sound enabled."
    : "Confirmation sound muted.";

  if (!state.soundEnabled && !state.hasConfirmed && !elements.manualConfirmButton.hidden) {
    showConfirmation();
  }
}

function wait(durationInMilliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationInMilliseconds);
  });
}
