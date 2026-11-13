const CORRECT_USER = "s";
const CORRECT_PASS = "ss";
const MESSAGE_ENDPOINT = "https://formsubmit.co/ajax/yamanahmad951@gmail.com";
const MESSAGE_EMAIL = "yamanahmad951@gmail.com";

const riddles = [
  {
    question: "شي صغير منك، بيخلّي يومي أحلى من دون ما تعملي شي. شو هو؟",
    hint: "ممكن يوصل عالتلفون، وممكن يضلّ ببالي طول النهار 📱",
    answers: ["رسالة", "الرسالة", "رساله", "الرساله", "رسالتك", "حكي", "كلمة", "كلمه"],
  },
  {
    question: "شو أسرع شي بيخلّيني ابتسم، حتى لو كنت معصّب؟",
    hint: "غالبًا بيطلع منك من دون ما تنتبهي 😊",
    answers: ["ضحكتك", "ضحكه", "ضحكة", "ابتسامتك", "ابتسامة", "ابتسامه", "ضحكتها"],
  },
  {
    question: "لما نحكي سوا، شو بيصير بالوقت؟",
    hint: "منبلّش نحكي شوي، وفجأة منلاقي الساعة ركضت ⏰",
    answers: ["بيطير", "الوقت بيطير", "بيمر", "بيمرق", "بسرعة", "بيركض"],
  },
  {
    question: "شي ما بينشرى ولا بينهدى بعلبة، بس وجوده بيخلّي القعدة أحلى. شو هو؟",
    hint: "إنتِ بتجيبيه معاكي وين ما رحتي 🤍",
    answers: ["وجودك", "وجود", "الوجود", "انت", "انتي", "إنتي"],
  },
  {
    question: "شو أحلى شي ممكن يوصلك من حدا مشتاق يحكي معك؟",
    hint: "كلمتين عالشاشة، بس بيعملوا فرق كبير 💌",
    answers: ["رسالة", "الرسالة", "رساله", "الرساله", "مسج", "مرحبا", "كيفك"],
  },
  {
    question: "إذا غبتي شوي عن يومي، شو بصير أعمل؟",
    hint: "بستنى ترجعي نحكي، وبقولها من قلبي 🤍",
    answers: ["بشتاقلك", "اشتقتلك", "بشتاق", "اشتاقلك", "بشتقلك", "الاشتياق"],
  },
  {
    question: "آخر سؤال، وجاوبيه عراحتك: بتحبّيني؟",
    hint: "اختاري جوابك... بس لا تستغربي إذا زر «ما بحبك» صار يتهرّب 😉",
    answers: [],
  },
];

const stages = {
  login: document.getElementById("login-stage"),
  quiz: document.getElementById("quiz-stage"),
  message: document.getElementById("message-stage"),
  greeting: document.getElementById("greeting-stage"),
};

let currentRiddle = 0;

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
  const progress = currentRiddle + 1;
  const progressBar = document.querySelector(".progress-track");
  const isFinalQuestion = currentRiddle === riddles.length - 1;
  const answerForm = document.getElementById("answer-form");
  const choiceArena = document.getElementById("choice-arena");

  document.getElementById("question-count").textContent =
    `السؤال ${progress} من ${riddles.length}`;
  document.getElementById("riddle").textContent = riddle.question;
  document.getElementById("hint").textContent = riddle.hint;
  document.getElementById("answer").value = "";
  document.getElementById("answer-feedback").textContent = "";
  answerForm.hidden = isFinalQuestion;
  choiceArena.hidden = !isFinalQuestion;
  document.getElementById("no-love-choice").style.cssText = "";
  document.getElementById("progress-fill").style.width =
    `${(progress / riddles.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(progress));
  if (isFinalQuestion) {
    document.getElementById("love-choice").focus();
  } else {
    document.getElementById("answer").focus();
  }
}

function addEmailFallback(feedback, message) {
  const fallbackLink = document.createElement("a");
  fallbackLink.className = "email-fallback";
  fallbackLink.href = `mailto:${MESSAGE_EMAIL}?subject=${encodeURIComponent("رسالة من بطاقة المعايدة")}&body=${encodeURIComponent(message)}`;
  fallbackLink.textContent = "إرسال الرسالة عبر البريد";
  feedback.append(" ", fallbackLink);
}

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const feedback = document.getElementById("login-error");

  if (username !== CORRECT_USER || password !== CORRECT_PASS) {
    feedback.textContent = "اسم المستخدم أو كلمة المرور مو صح، جرّبي مرة تانية 🤍";
    return;
  }

  feedback.textContent = "";
  showStage("quiz");
  renderRiddle();
});

document.getElementById("answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentRiddle >= riddles.length - 1) return;

  const answer = normalizeAnswer(document.getElementById("answer").value);
  const acceptedAnswers = riddles[currentRiddle].answers.map(normalizeAnswer);
  const feedback = document.getElementById("answer-feedback");

  if (!acceptedAnswers.includes(answer)) {
    feedback.textContent = "مو هي، جرّبي كمان مرة… التلميح بيساعد 😉";
    return;
  }

  currentRiddle += 1;
  renderRiddle();
});

function moveNoLoveChoice() {
  const arena = document.getElementById("choice-arena");
  const button = document.getElementById("no-love-choice");
  const maxLeft = Math.max(0, arena.clientWidth - button.offsetWidth);
  const maxTop = Math.max(0, arena.clientHeight - button.offsetHeight);

  button.style.position = "absolute";
  button.style.left = `${Math.random() * maxLeft}px`;
  button.style.top = `${Math.random() * maxTop}px`;
}

document.getElementById("love-choice").addEventListener("click", () => {
  showStage("message");
  document.getElementById("sender-name").focus();
});

document.getElementById("no-love-choice").addEventListener("pointerenter", moveNoLoveChoice);
document.getElementById("no-love-choice").addEventListener("focus", moveNoLoveChoice);
document.getElementById("no-love-choice").addEventListener("click", (event) => {
  event.preventDefault();
  moveNoLoveChoice();
  document.getElementById("answer-feedback").textContent =
    "حتى الزر مو راضي يقولها… جرّبي التاني 😉";
});

document.getElementById("message-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const sendButton = document.getElementById("send-button");
  const feedback = document.getElementById("message-feedback");
  const continueButton = document.getElementById("continue-button");
  const formData = new FormData(form);
  const senderName = String(formData.get("name") || "").trim() || "مفاجأة حلوة";
  const message = String(formData.get("message") || "").trim();

  if (!message) {
    feedback.textContent = "اكتبيلي رسالة صغيرة قبل الإرسال 🤍";
    return;
  }

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
      throw new Error(`تعذر قراءة رد خدمة الإرسال (HTTP ${response.status}).`);
    }

    if (!response.ok || String(result.success).toLowerCase() !== "true") {
      throw new Error(result.message || result.error || `رفضت خدمة الإرسال الطلب (HTTP ${response.status}).`);
    }

    feedback.classList.add("success");
    feedback.textContent = "وصلتني رسالتك، شكرًا من قلبي 🤍";
    form.reset();
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (/confirm|activation|verify/i.test(reason)) {
      feedback.textContent =
        "خدمة الإرسال بدها تفعيل أول مرة. افتحي رسالة التفعيل اللي وصلتك على بريد الاستقبال، وبعدها جرّبي الإرسال.";
    } else if (reason === "Failed to fetch" && window.location.protocol === "file:") {
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
  showStage("greeting");
});
