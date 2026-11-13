const CORRECT_USER = "s";
const CORRECT_PASS = "ss";
const MESSAGE_ENDPOINT = "https://formsubmit.co/ajax/yamanahmad951@gmail.com";
const MESSAGE_EMAIL = "yamanahmad951@gmail.com";

const riddles = [
  {
    question: "له عقارب وما بيلدغ، وبيخبرنا قديش الساعة. شو هو؟",
    hint: "شي منطلّع عليه لنعرف الوقت 🕰️",
    answers: ["ساعة", "الساعة", "ساعه", "الساعه"],
  },
  {
    question: "إله أسنان، بس عمره ما بيعض. شو هو؟",
    hint: "منستعمله لنرتّب شعرنا 🌸",
    answers: ["مشط", "المشط"],
  },
  {
    question: "كل ما أخدت منه، بيكبر أكتر. شو هو؟",
    hint: "بتلاقيه بالأرض، وممكن تحفريه 🕳️",
    answers: ["حفرة", "الحفرة", "حفره", "الحفره"],
  },
  {
    question: "بيمشي بالسما بلا رجلين، وبيبكي بلا عينين. شو هو؟",
    hint: "لما يبكي، ممكن ينزل المطر ☁️",
    answers: ["سحاب", "السحاب", "غيم", "الغيم", "غيمة", "الغيمة", "غيمه", "الغيمه"],
  },
  {
    question: "بتشوفيه بالليل منوّر بالسما، وبيختفي الصبح. شو هو؟",
    hint: "مو الشمس، وبيصير بدر بليالي الشهر 🌙",
    answers: ["قمر", "القمر"],
  },
  {
    question: "إلك شي خاص فيكي، والناس بينادوكي فيه. شو هو؟",
    hint: "أهلك اختاروه إلك وإنتِ صغيرة 💌",
    answers: ["اسم", "الاسم", "اسمك"],
  },
  {
    question: "شي كل ما شاركناه مع الناس، بيكبر وما بينقص. شو هو؟",
    hint: "منعطيه من قلبنا وبيخلّي الدنيا أحلى 🤍",
    answers: ["حب", "الحب", "محبة", "المحبة", "فرح", "الفرح", "سعادة", "السعادة"],
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

  document.getElementById("question-count").textContent =
    `اللغز ${progress} من ${riddles.length}`;
  document.getElementById("riddle").textContent = riddle.question;
  document.getElementById("hint").textContent = riddle.hint;
  document.getElementById("answer").value = "";
  document.getElementById("answer-feedback").textContent = "";
  document.getElementById("progress-fill").style.width =
    `${(progress / riddles.length) * 100}%`;
  progressBar.setAttribute("aria-valuenow", String(progress));
  document.getElementById("answer").focus();
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
  const answer = normalizeAnswer(document.getElementById("answer").value);
  const acceptedAnswers = riddles[currentRiddle].answers.map(normalizeAnswer);
  const feedback = document.getElementById("answer-feedback");

  if (!acceptedAnswers.includes(answer)) {
    feedback.textContent = "مو هي، بس قريبة! جرّبي مرة تانية أو شوفي التلميح 🌷";
    return;
  }

  currentRiddle += 1;
  if (currentRiddle === riddles.length) {
    showStage("message");
    document.getElementById("sender-name").focus();
    return;
  }

  renderRiddle();
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
