/* global grecaptcha */

(function () {
  const form = document.getElementById("comment-form");
  if (!form) return;

  const submitButton = document.getElementById("comment-form-submit");
  const notice = document.querySelector("#respond .js-notice");
  const noticeText = document.querySelector("#respond .js-notice-text");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    fetch(form.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(new FormData(form))
    })
      .then(res => {
        if (!res.ok) throw new Error("Submission failed");
        return res.json();
      })
      .then(() => {
        form.reset();
        grecaptcha.reset();
        submitButton.textContent = "Submitted";
        notice.classList.remove("hidden");
        noticeText.innerHTML =
          "<strong>Thanks!</strong> Your comment was submitted and will appear shortly.";
      })
      .catch(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Submit comment";
        notice.classList.remove("hidden");
        noticeText.innerHTML =
          "<strong>Error.</strong> Please try again.";
      });
  });
})();
