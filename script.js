const CORRECT_USER = "s";
const CORRECT_PASS = "ss";
const MESSAGE_ENDPOINT = "https://formsubmit.co/ajax/yamanahmad951@gmail.com";
const MESSAGE_EMAIL = "yamanahmad951@gmail.com";

const riddles = [
  {
    question: "شو أول شي بيخلّي الواحد يبتسم غصب عنه لما يشوف حدا بيعزّ عليه؟",
    hint: "بتطلع عالوجه من غير استئذان 😉",
    answers: ["ابتسامة", "الابتسامة", "ابتسامه", "الابتسامه", "بسمة", "البسمة", "ضحكة", "الضحكة"],
  },
  {
    question: "بتنبعت بكبسة، وإذا إجت من حدا غالي بتخلّي نهارك أحلى. شو هي؟",
    hint: "ممكن تكون كلمة، أو حتى بس «مرحبا» 💌",
    answers: ["رسالة", "الرسالة", "مسج", "المسج"],
  },
  {
    question: "شي من القلب، وكل ما عطيتِ منه للناس بيكبر أكتر. شو هو؟",
    hint: "مو هدية بتنشرى، بس أغلى بكتير 🤍",
    answers: ["حب", "الحب", "محبة", "المحبة"],
  },
  {
    question: "بتكون عالطاولة بفنجان، وبتحلى أكتر مع القعدة الحلوة. شو هي؟",
    hint: "ريحة بتصحصح وبتروّق ☕",
    answers: ["قهوة", "القهوة", "قهوه", "القهوه"],
  },
  {
    question: "إلها ريحة حلوة، ولما تهديها لحدا بتقول كلام كتير من غير ما تحكي. شو هي؟",
    hint: "هدية بسيطة وبتفرّح القلب 🌷",
    answers: ["وردة", "الوردة", "زهرة", "الزهرة"],
  },
  {
    question: "مع الشخص الصح بتبلّش خمس دقايق، وفجأة بتصير ساعتين. شو هي؟",
    hint: "بتكون أحلى مع قهوة وحديث من القلب ✨",
    answers: ["قعدة", "القعدة", "جلسة", "الجلسة", "سهرة", "السهرة"],
  },
  {
    question: "خلصوا الألغاز، بس ضلّ سؤال من القلب… أي كلمة كنت حابب تسمعيها مني؟",
    hint: "اختاري جوابك 😉",
    type: "choice",
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
  const answerForm = document.getElementById("answer-form");
  const choiceButtons = document.getElementById("choice-buttons");
  const feedback = document.getElementById("answer-feedback");

  document.getElementById("question-count").textContent =
    `اللغز ${progress} من ${riddles.length}`;
  document.getElementById("riddle").textContent = riddle.question;
  document.getElementById("hint").textContent = riddle.hint;
  document.getElementById("answer").value = "";
  feedback.textContent = "";
  feedback.classList.remove("success");
  answerForm.hidden = riddle.type === "choice";
  choiceButtons.hidden = riddle.type !== "choice";
  document.getElementById("progress-fill").style.width =
    `${(progress / riddles.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(progress));
  if (riddle.type === "choice") {
    document.getElementById("love-button").focus();
  } else {
    document.getElementById("answer").focus();
  }
}

function finishQuiz() {
  showStage("message");
  document.getElementById("sender-name").focus();
}

function dodgeNoLoveButton(event) {
  if (event.cancelable) {
    event.preventDefault();
  }

  const container = document.getElementById("choice-buttons");
  const button = document.getElementById("no-love-button");
  const containerBounds = container.getBoundingClientRect();
  const buttonBounds = button.getBoundingClientRect();
  const maxLeft = Math.max(0, containerBounds.width - buttonBounds.width);
  const maxTop = Math.max(0, containerBounds.height - buttonBounds.height);

  button.classList.add("is-dodging");
  button.style.left = `${Math.random() * maxLeft}px`;
  button.style.top = `${Math.random() * maxTop}px`;
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
    feedback.textContent = "اسم المستخدم أو كلمة السر مو مزبوطين، جرّبي كمان مرة 🤍";
    return;
  }

  feedback.textContent = "";
  showStage("quiz");
  renderRiddle();
});

document.getElementById("answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = normalizeAnswer(document.getElementById("answer").value);
  const acceptedAnswers = riddles[currentRiddle].answers.map(normalizeAnswer);
  const feedback = document.getElementById("answer-feedback");

  if (!acceptedAnswers.includes(answer)) {
    feedback.textContent = "مو هي، بس قريبة! جرّبي كمان مرة أو شوفي التلميح 🌷";
    return;
  }

  currentRiddle += 1;
  renderRiddle();
});

document.getElementById("love-button").addEventListener("click", finishQuiz);
document.getElementById("no-love-button").addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    dodgeNoLoveButton(event);
  }
});
document.getElementById("no-love-button").addEventListener("pointerdown", dodgeNoLoveButton);
document.getElementById("no-love-button").addEventListener("click", dodgeNoLoveButton);

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
    feedback.textContent = "اكتبيلي شي صغير قبل ما تبعتيها 🤍";
    return;
  }

  if (window.location.protocol === "file:") {
    feedback.textContent =
      "الإرسال التلقائي ما بيشتغل والملف مفتوح لحاله. افتحي الموقع من رابطه، أو ابعتيها من بريدك:";
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
    feedback.textContent = "وصلتني رسالتك، يسلملي قلبك 🤍";
    form.reset();
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (/confirm|activation|verify/i.test(reason)) {
      feedback.textContent =
        "لازم يتفعّل الإيميل أول شي. افتحي رسالة التفعيل اللي وصلتك واضغطي على الرابط، وبعدين جرّبي كمان مرة.";
    } else if (reason === "Failed to fetch" && window.location.protocol === "file:") {
      feedback.textContent =
        "الإرسال التلقائي ما بيشتغل والملف مفتوح لحاله. افتحي الموقع من رابطه، أو ابعتيها من بريدك:";
    } else if (reason === "Failed to fetch") {
      feedback.textContent =
        "ما قدرنا نتصل بخدمة الإرسال. تأكدي من الإنترنت وجرّبي كمان مرة.";
    } else {
      feedback.textContent = reason
        ? `ما انبعتت الرسالة: ${reason}`
        : "ما زبط الإرسال هالمرة، جرّبي كمان مرة.";
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
