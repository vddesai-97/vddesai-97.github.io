/* global grecaptcha */

(function () {
  const form = document.getElementById("comment-form");
  if (!form) return;

  const submitButton = document.getElementById("comment-form-submit");
  const notice = document.querySelector("#respond .js-notice");
  const noticeText = document.querySelector("#respond .js-notice-text");

  window.verifyCaptcha = function (token) {
  if (!token) return;
  // add token to hidden input
  let captchaInput = document.getElementById("g-recaptcha-response");
  if (!captchaInput) {
    captchaInput = document.createElement("input");
    captchaInput.type = "hidden";
    captchaInput.name = "g-recaptcha-response";
    captchaInput.id = "g-recaptcha-response";
    form.appendChild(captchaInput);
  }
  captchaInput.value = token;

  submitButton.disabled = false;
  submitButton.setAttribute("aria-disabled", "false");
};

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
          "<strong>Thanks!</strong> Your comment was submitted.";
      })
      .catch(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Submit comment";
        notice.classList.remove("hidden");
        noticeText.innerHTML =
          "<strong>Error.</strong> Please try again.";
      });
  });

  window.addComment = {
    moveForm: function (_, parentId, respondId) {
      const respond = document.getElementById(respondId);
      const parent = document.getElementById("comment-replying-to");
      const cancel = document.getElementById("cancel-comment-reply-link");
      const heading = document.getElementById("comment-heading-text");

      parent.value = parentId;
      heading.textContent = "Replying";
      cancel.style.display = "inline";

      cancel.onclick = function () {
        parent.value = "";
        heading.textContent = "Leave a comment";
        cancel.style.display = "none";
        return false;
      };

      respond.scrollIntoView({ behavior: "smooth" });
      return false;
    }
  };
})();
