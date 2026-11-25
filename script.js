const CORRECT_USER = "sahar";
const CORRECT_PASS = "@Sahar001395119271968";
const MESSAGE_ENDPOINT = "https://formsubmit.co/ajax/yamanahmad951@gmail.com";
const MESSAGE_EMAIL = "yamanahmad951@gmail.com";

const riddles = [
  {
    question: "قبل ما نبلّش… بتحبّيني؟",
    hint: "الجواب اجباري بحبك لان مابحبك او مارح خبرك جربيه ",
    answers: [],
  },
  {
    question: "تحدّي البالونات المتطايرة 🎈",
    hint: "طقي البوالين واشوفي الشغلات اللي بحبّها فيكي.",
    answers: [],
  },
  {
    type: "challenge",
    challenge: "ثبّت القلب",
    question: "ثبّتِي الضغط على القلب لمدة ثانيتين ونصف.",
    hint: "القلب يحتاج لك حاضرة بثبات 🤍",
  },
];

const stages = {
  login: document.getElementById("login-stage"),
  quiz: document.getElementById("quiz-stage"),
  message: document.getElementById("message-stage"),
  greeting: document.getElementById("greeting-stage"),
};

let currentRiddle = 0;
const TOTAL_STEPS = riddles.length;
let messageWritten = false;
let challengeAdvancing = false;

function renderAppleEmojis(root) {
  const emojiPattern =
    /\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?|\p{Regional_Indicator}{2}/gu;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((textNode) => {
    if (!emojiPattern.test(textNode.nodeValue)) return;
    emojiPattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    textNode.nodeValue.replace(emojiPattern, (emoji, offset) => {
      fragment.append(
        document.createTextNode(textNode.nodeValue.slice(lastIndex, offset)),
      );
      const image = document.createElement("img");
      image.className = "apple-emoji";
      image.src = `https://emojicdn.elk.sh/${encodeURIComponent(emoji)}?style=apple`;
      image.alt = emoji;
      image.setAttribute("aria-hidden", "true");
      fragment.append(image);
      lastIndex = offset + emoji.length;
      return emoji;
    });
    fragment.append(
      document.createTextNode(textNode.nodeValue.slice(lastIndex)),
    );
    textNode.replaceWith(fragment);
  });
}

function showStage(stageName) {
  Object.entries(stages).forEach(([name, element]) => {
    const isActive = name === stageName;
    element.hidden = !isActive;
    element.classList.toggle("active", isActive);
  });
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function renderChallenge(index) {
  const arena = document.getElementById("challenge-arena");
  arena.replaceChildren();

  if (index === 2) {
    const button = document.createElement("button");
    const progress = document.createElement("span");
    const heartImage = document.createElement("img");
    let holdTimer;
    let progressTimer;
    let elapsed = 0;
    button.type = "button";
    button.className = "hold-heart";
    heartImage.className = "hold-heart-image";
    heartImage.src = "https://emojicdn.elk.sh/🤍?style=apple";
    heartImage.alt = "";
    heartImage.setAttribute("aria-hidden", "true");
    progress.className = "hold-progress";
    button.append(heartImage);
    button.append(progress);

    const cancelHold = () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(holdTimer);
      elapsed = 0;
      progress.style.height = "0";
    };
    button.addEventListener("pointerdown", () => {
      cancelHold();
      progressTimer = window.setInterval(() => {
        elapsed += 50;
        progress.style.height = `${Math.min(100, (elapsed / 2500) * 100)}%`;
      }, 50);
      holdTimer = window.setTimeout(() => advanceChallenge(button), 2500);
    });
    button.addEventListener("pointerup", cancelHold);
    button.addEventListener("pointerleave", cancelHold);
    button.addEventListener("pointercancel", cancelHold);
    arena.append(button);
  }
}

function advanceChallenge(sourceButton) {
  if (challengeAdvancing) return;
  challengeAdvancing = true;
  sourceButton.disabled = true;
  window.setTimeout(() => {
    challengeAdvancing = false;
    showStage("message");
    document.getElementById("message").focus();
  }, 220);
}

function renderRiddle() {
  const riddle = riddles[currentRiddle];
  const progress = currentRiddle + 1;
  const progressBar = document.querySelector(".progress-track");
  const isLoveQuestion = currentRiddle === 0;
  const isBalloonChallenge = currentRiddle === 1;
  const isChallenge = riddle.type === "challenge";
  const answerForm = document.getElementById("answer-form");
  const choiceArena = document.getElementById("choice-arena");
  const balloonGame = document.getElementById("balloon-game");
  const challengeArena = document.getElementById("challenge-arena");

  document.getElementById("question-count").textContent =
    `التحدّي ${progress} من ${TOTAL_STEPS}`;
  document.getElementById("quiz-title").textContent = isBalloonChallenge
    ? "تحدّي البالونات المتطايرة 🎈"
    : isChallenge
      ? riddle.challenge
      : "قبل ما نكمّل 🤍";
  document.getElementById("riddle").textContent = riddle.question;
  document.getElementById("riddle").hidden = isBalloonChallenge;
  document.getElementById("hint").textContent = riddle.hint;
  document.getElementById("hint").hidden = isBalloonChallenge;
  const answerInput = document.getElementById("answer");
  answerInput.value = "";
  answerInput.placeholder = "كتبي إجابتك";
  document.getElementById("answer-feedback").textContent = "";
  answerForm.hidden = isLoveQuestion || isBalloonChallenge || isChallenge;
  choiceArena.hidden = !isLoveQuestion;
  balloonGame.hidden = !isBalloonChallenge;
  challengeArena.hidden = !isChallenge;
  if (isChallenge) renderChallenge(currentRiddle);
  if (isLoveQuestion) {
    document.getElementById("no-love-choice").style.cssText = "";
  }
  document.getElementById("progress-fill").style.width =
    `${(progress / TOTAL_STEPS) * 100}%`;
  progressBar.setAttribute("aria-valuemax", String(TOTAL_STEPS));
  progressBar.setAttribute("aria-valuenow", String(progress));
  if (isBalloonChallenge) {
    document.querySelector(".balloon:not(.popped)")?.focus();
  } else if (isLoveQuestion) {
    document.getElementById("love-choice").focus();
  } else {
    document.getElementById("answer").focus();
  }
  renderAppleEmojis(document.body);
}

function addEmailFallback(
  feedback,
  message,
  subject = "رسالة من بطاقة المعايدة",
  linkText = "إرسال الرسالة عبر البريد",
) {
  const fallbackLink = document.createElement("a");
  fallbackLink.className = "email-fallback";
  fallbackLink.href = `mailto:${MESSAGE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  fallbackLink.textContent = linkText;
  feedback.append(" ", fallbackLink);
}

function moveNoLoveChoice() {
  const arena = document.getElementById("choice-arena");
  const loveButton = document.getElementById("love-choice");
  const noLoveButton = document.getElementById("no-love-choice");
  const arenaRect = arena.getBoundingClientRect();
  const loveRect = loveButton.getBoundingClientRect();
  const maxLeft = Math.max(0, arena.clientWidth - noLoveButton.offsetWidth);
  const maxTop = Math.max(0, arena.clientHeight - noLoveButton.offsetHeight);
  const loveCenterX = loveRect.left - arenaRect.left + loveRect.width / 2;
  const loveCenterY = loveRect.top - arenaRect.top + loveRect.height / 2;

  noLoveButton.style.position = "absolute";

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;
    const noLoveCenterX = left + noLoveButton.offsetWidth / 2;
    const noLoveCenterY = top + noLoveButton.offsetHeight / 2;
    const distance = Math.hypot(
      noLoveCenterX - loveCenterX,
      noLoveCenterY - loveCenterY,
    );

    if (distance >= 100) {
      noLoveButton.style.left = `${left}px`;
      noLoveButton.style.top = `${top}px`;
      return;
    }
  }

  noLoveButton.style.left = "8px";
  noLoveButton.style.top = `${maxTop}px`;
}

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document
    .getElementById("username")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("password").value.trim();
  const feedback = document.getElementById("login-error");

  if (username !== CORRECT_USER || password !== CORRECT_PASS) {
    feedback.textContent =
      "اسم المستخدم أو كلمة المرور غير صحيح، جرّبي مرة ثانية 🤍";
    return;
  }

  feedback.textContent = "";
  showStage("quiz");
  renderRiddle();
});

document.getElementById("answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentRiddle >= riddles.length - 2) return;

  const answer = document.getElementById("answer").value.trim();
  if (!answer) return;

  const normalizedAnswer = normalizeAnswer(answer);
  const acceptedAnswers = riddles[currentRiddle].answers.map(normalizeAnswer);
  const feedback = document.getElementById("answer-feedback");

  if (!acceptedAnswers.includes(normalizedAnswer)) {
    feedback.textContent = "مو هي، جرّبي كمان مرة… التلميح بساعد 😉";
    return;
  }

  currentRiddle += 1;
  renderRiddle();
});

document.getElementById("love-choice").addEventListener("click", () => {
  currentRiddle = 1;
  renderRiddle();
});

document
  .getElementById("no-love-choice")
  .addEventListener("pointerenter", moveNoLoveChoice);
document
  .getElementById("no-love-choice")
  .addEventListener("focus", moveNoLoveChoice);
document.getElementById("no-love-choice").addEventListener("click", () => {
  moveNoLoveChoice();
  document.getElementById("answer-feedback").textContent =
    "اختاري زر «بحبك» عشان نكمّل 🤍";
});

document.querySelectorAll(".balloon").forEach((balloon) => {
  balloon.addEventListener("click", () => {
    balloon.disabled = true;
    balloon.classList.add("popped");
    const reveal = document.getElementById("balloon-reveal");
    reveal.textContent = `بحبّ فيكي... ${balloon.dataset.trait} 🤍`;
    reveal.classList.remove("reveal-pop");
    void reveal.offsetWidth;
    reveal.classList.add("reveal-pop");
    renderAppleEmojis(reveal);

    const remaining = document.querySelectorAll(".balloon:not(.popped)").length;
    document.getElementById("balloon-count").textContent = remaining
      ? `باقي ${remaining} بالونات 🎈`
      : "وآخر بالون خبّى خطوة صغيرة قبل المعايدة… 🤍";
    renderAppleEmojis(document.getElementById("balloon-count"));

    if (remaining === 0) {
      window.setTimeout(() => {
        currentRiddle += 1;
        renderRiddle();
      }, 700);
    }
  });
});

document
  .getElementById("message-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const sendButton = document.getElementById("send-button");
    const feedback = document.getElementById("message-feedback");
    const continueButton = document.getElementById("continue-button");
    const formData = new FormData(form);
    const senderName =
      String(formData.get("name") || "").trim() || "مفاجأة حلوة";
    const message = String(formData.get("message") || "").trim();

    if (!message) {
      feedback.textContent = "اكتبيلي رسالة صغيرة قبل الإرسال 🤍";
      renderAppleEmojis(feedback);
      return;
    }

    messageWritten = true;

    if (window.location.protocol === "file:") {
      feedback.textContent =
        "الإرسال التلقائي ما بيشتغل عند فتح الملف مباشرة. انشري الموقع على رابط ويب، أو استخدمي الإرسال عبر البريد:";
      addEmailFallback(feedback, message);
      continueButton.hidden = false;
      return;
    }

    sendButton.disabled = true;
    feedback.classList.remove("success");
    feedback.replaceChildren();
    feedback.textContent = "عم ببعت رسالتك... 💌";
    renderAppleEmojis(feedback);

    try {
      const response = await fetch(MESSAGE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          name: senderName,
          message,
          _subject: "رسالة جديدة من بطاقة المعايدة",
        }),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `تعذر قراءة رد خدمة الإرسال (HTTP ${response.status}).`,
        );
      }

      if (!response.ok || String(result.success).toLowerCase() !== "true") {
        throw new Error(
          result.message ||
            result.error ||
            `رفضت خدمة الإرسال الطلب (HTTP ${response.status}).`,
        );
      }

      feedback.classList.add("success");
      feedback.textContent = "وصلتني رسالتك، شكرًا من قلبي 🤍";
      renderAppleEmojis(feedback);
      form.reset();
    } catch (error) {
      const reason = error instanceof Error ? error.message : "";
      if (/confirm|activation|verify/i.test(reason)) {
        feedback.textContent =
          "خدمة الإرسال بدها تفعيل أول مرة. افتحي رسالة التفعيل اللي وصلتك على بريد الاستقبال، وبعدها جرّبي الإرسال.";
      } else if (
        reason === "Failed to fetch" &&
        window.location.protocol === "file:"
      ) {
        feedback.textContent =
          "الإرسال التلقائي ما بيشتغل عند فتح الملف مباشرة. انشري الموقع على رابط ويب، أو استخدمي الإرسال عبر البريد:";
      } else if (reason === "Failed to fetch") {
        feedback.textContent =
          "تعذّر الاتصال بخدمة الإرسال. تأكدي من اتصال الإنترنت وحاولي مرة تانية.";
      } else {
        feedback.textContent = reason
          ? `ما انبعتت الرسالة: ${reason}`
          : "ما انبعتت الرسالة بسبب خطأ غير معروف. جرّبي مرة تانية.";
      }
      addEmailFallback(feedback, message);
      console.error("Message delivery failed:", error);
    } finally {
      sendButton.disabled = false;
      continueButton.hidden = false;
    }
  });

document.getElementById("continue-button").addEventListener("click", () => {
  if (!messageWritten) {
    document.getElementById("message-feedback").textContent =
      "اكتبيلي رسالة قبل ما تكمّلي للمعايدة 🤍";
    document.getElementById("message").focus();
    return;
  }
  showStage("greeting");
});

renderAppleEmojis(document.body);
