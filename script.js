const CORRECT_USER = "sahar";
const CORRECT_PASS = "@Sahar001395119271968";
const MESSAGE_ENDPOINT = "https://formsubmit.co/ajax/yamanahmad951@gmail.com";
const MESSAGE_EMAIL = "yamanahmad951@gmail.com";
const COMPATIBILITY_EMAIL_SUBJECT = "إجابات اختبار كم بتعرفيني؟";

const riddles = [
  {
    question: "شي صغير منك، بيخلّي يومي أحلى من دون ما تعملي شي. شو هو؟",
    hint: "ممكن يوصل عالتلفون، وممكن يضلّ ببالي طول النهار 📱",
    answers: [
      "رسالة",
      "الرسالة",
      "رساله",
      "الرساله",
      "رسالتك",
      "حكي",
      "كلمة",
      "كلمه",
    ],
  },
  {
    question: "شو أسرع شي بيخلّيني ابتسم، حتى لو كنت معصّب؟",
    hint: "غالبًا بيطلع منك من دون ما تنتبهي 😊",
    answers: [
      "ضحكتك",
      "ضحكه",
      "ضحكة",
      "ابتسامتك",
      "ابتسامة",
      "ابتسامه",
      "ضحكتها",
    ],
  },
  {
    question: "لما نحكي سوا، شو بيصير بالوقت؟",
    hint: "منبلّش نحكي شوي، وفجأة منلاقي الساعة ركضت ⏰",
    answers: ["بيطير", "الوقت بيطير", "بيمر", "بيمرق", "بسرعة", "بيركض"],
  },
  {
    question:
      "شي ما بينشرى ولا بينهدى بعلبة، بس وجوده بيخلّي القعدة أحلى. شو هو؟",
    hint: "إنتِ بتجيبيه معاكي وين ما رحتي 🤍",
    answers: ["وجودك", "وجود", "الوجود", "انت", "انتي", "إنتي"],
  },
  {
    question: "اختبار «كم بتعرفيني؟»",
    hint: "",
    answers: [],
  },
  {
    question: "قبل ما نبلّش بالبالونات... بتحبّيني؟",
    hint: "اختاري جوابك من قلبك 🤍",
    answers: [],
  },
  {
    question: "تحدّي البالونات المتطايرة 🎈",
    hint: "فقّعي البالونات واكتشفي الصفات اللي بحبّها فيكي.",
    answers: [],
  },
];

const compatibilityQuestions = [
  "شو أكتر أكلة بتحبيها؟",
  "لو طلعنا مشوار سوا، وين بتحبي نروح؟",
  "شو الشي البسيط اللي بيحسّن مزاجك بسرعة؟",
  "شو أحلى ذكرى أو موقف بتحبي تتذكريه بيناتنا؟",
  "شو أمنية أو شي نفسك نعمله سوا؟",
];

const stages = {
  login: document.getElementById("login-stage"),
  quiz: document.getElementById("quiz-stage"),
  message: document.getElementById("message-stage"),
  greeting: document.getElementById("greeting-stage"),
};

let currentRiddle = 0;
let compatibilityQuestion = 0;
const compatibilityAnswers = [];
const COMPATIBILITY_RIDDLE_INDEX = 4;
const TOTAL_STEPS = riddles.length + compatibilityQuestions.length - 1;
let messageWritten = false;

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

function renderRiddle() {
  const riddle = riddles[currentRiddle];
  const isCompatibilityQuiz = currentRiddle === COMPATIBILITY_RIDDLE_INDEX;
  const progress = isCompatibilityQuiz
    ? COMPATIBILITY_RIDDLE_INDEX + 1 + compatibilityQuestion
    : currentRiddle < COMPATIBILITY_RIDDLE_INDEX
      ? currentRiddle + 1
      : currentRiddle + compatibilityQuestions.length;
  const progressBar = document.querySelector(".progress-track");
  const isBalloonChallenge = currentRiddle === riddles.length - 1;
  const isLoveQuestion = currentRiddle === riddles.length - 2;
  const answerForm = document.getElementById("answer-form");
  const choiceArena = document.getElementById("choice-arena");
  const balloonGame = document.getElementById("balloon-game");

  document.getElementById("question-count").textContent = isCompatibilityQuiz
    ? `اختبار التوافق ${compatibilityQuestion + 1} من ${compatibilityQuestions.length}`
    : `السؤال ${progress} من ${TOTAL_STEPS}`;
  document.getElementById("quiz-title").textContent = isBalloonChallenge
    ? "تحدّي البالونات المتطايرة 🎈"
    : isCompatibilityQuiz
      ? "اختبار «كم بتعرفيني؟» 💌"
      : "ركّزي معي شوي 😉";
  document.getElementById("riddle").textContent = isCompatibilityQuiz
    ? compatibilityQuestions[compatibilityQuestion]
    : riddle.question;
  document.getElementById("riddle").hidden = isBalloonChallenge;
  document.getElementById("hint").textContent = isCompatibilityQuiz
    ? "جاوبي براحتك، ما في جواب غلط 🤍"
    : riddle.hint;
  document.getElementById("hint").hidden = isBalloonChallenge;
  const answerInput = document.getElementById("answer");
  answerInput.value = "";
  answerInput.placeholder = isCompatibilityQuiz
    ? "اكتبي جوابك هون..."
    : "شو بتتوقعي؟";
  document.getElementById("answer-feedback").textContent = "";
  answerForm.hidden = isLoveQuestion || isBalloonChallenge;
  choiceArena.hidden = !isLoveQuestion;
  balloonGame.hidden = !isBalloonChallenge;
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

async function sendCompatibilityAnswers() {
  const feedback = document.getElementById("answer-feedback");
  const subject = COMPATIBILITY_EMAIL_SUBJECT;
  const message = compatibilityAnswers
    .map(
      ({ question, answer }, index) =>
        `${index + 1}. ${question}\nالإجابة: ${answer}`,
    )
    .join("\n\n");

  feedback.replaceChildren();
  feedback.textContent = "عم ببعت أجوبتك عالإيميل... 💌";

  if (window.location.protocol === "file:") {
    feedback.textContent =
      "الإرسال التلقائي ما بيشتغل عند فتح الملف مباشرة. فيكي تبعتي الأجوبة من هون:";
    addEmailFallback(feedback, message, subject, "إرسال الأجوبة عبر البريد");
    return;
  }

  try {
    const response = await fetch(MESSAGE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        name: "إجابات اختبار كم بتعرفيني؟",
        message,
        _subject: subject,
      }),
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(`تعذر قراءة رد خدمة الإرسال (HTTP ${response.status}).`);
    }

    if (!response.ok || String(result.success).toLowerCase() !== "true") {
      throw new Error(
        result.message ||
          result.error ||
          `رفضت خدمة الإرسال الطلب (HTTP ${response.status}).`,
      );
    }

    feedback.classList.add("success");
    feedback.textContent = "وصلتني أجوبتك، شكرًا يا حلوة 🤍";
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    feedback.textContent = reason
      ? `ما انبعتت الأجوبة: ${reason}`
      : "ما انبعتت الأجوبة بسبب خطأ غير معروف.";
    addEmailFallback(feedback, message, subject, "إرسال الأجوبة عبر البريد");
    console.error("Compatibility answers delivery failed:", error);
  }
}

function moveNoLoveChoice() {
  const arena = document.getElementById("choice-arena");
  const button = document.getElementById("no-love-choice");
  const maxLeft = Math.max(0, arena.clientWidth - button.offsetWidth);
  const maxTop = Math.max(0, arena.clientHeight - button.offsetHeight);

  button.style.position = "absolute";
  button.style.left = `${Math.random() * maxLeft}px`;
  button.style.top = `${Math.random() * maxTop}px`;
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
      "اسم المستخدم أو كلمة المرور مو صح، جرّبي مرة تانية 🤍";
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

  if (currentRiddle === COMPATIBILITY_RIDDLE_INDEX) {
    compatibilityAnswers.push({
      question: compatibilityQuestions[compatibilityQuestion],
      answer,
    });
    compatibilityQuestion += 1;

    if (compatibilityQuestion < compatibilityQuestions.length) {
      renderRiddle();
      return;
    }

    currentRiddle += 1;
    renderRiddle();
    void sendCompatibilityAnswers();
    return;
  }

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
  currentRiddle += 1;
  document.getElementById("no-love-choice").style.cssText = "";
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
    "حتى الزر مو راضي يقولها… جرّبي التاني 😉";
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

    const remaining = document.querySelectorAll(".balloon:not(.popped)").length;
    document.getElementById("balloon-count").textContent = remaining
      ? `باقي ${remaining} بالونات 🎈`
      : "وآخر بالون خبّى خطوة صغيرة قبل المعايدة… 🤍";

    if (remaining === 0) {
      window.setTimeout(() => {
        showStage("message");
        document.getElementById("message").focus();
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
