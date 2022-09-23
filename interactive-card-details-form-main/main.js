const hasError = (input) => {
  if (input.type === "submit") return;

  var validity = input.validity;

  if (validity.valid) return;

  if (validity.patternMismatch) {
    if (input.value.match(/[^\d\s]/)) {
      return "Wrong format, numbers only";
    }

    if (input.id === "month" && !input.value.match(/0[1-9]|1[0-2]/)) {
      return "Invalid month";
    }

    if (input.id === "year" && !input.value.match(/[23][2-9]/)) {
      return "Invalid year";
    }

    return `A length of ${
      input.minLength === 19 ? 16 : input.minLength
    } is required`;
  }

  if (validity.valueMissing) return "Can't be blank";

  return "The input is invalid";
};

const showError = (input, error) => {
  input.classList.add("error");

  let id = input.id;

  if (input.parentNode.classList.contains("datecol")) {
    id = "datecol";
    input.parentNode.classList.add("error");
  }

  let message = input.form.querySelector(`.error-message#error-for-${id}`);

  if (!message) {
    message = document.createElement("div");
    message.className = "error-message";
    message.id = `error-for-${id}`;

    if (input.parentNode.classList.contains("datecol")) {
      const parent = input.parentNode;
      parent.insertBefore(message, parent.lastChild);
    } else {
      input.parentNode.insertBefore(message, input.nextSibling);
    }
  }

  input.setAttribute("aria-describedby", `error-for-${id}`);

  message.innerHTML = error;
  message.style.display = "block";
  message.style.visibility = "visible";
};

const removeError = (input) => {
  input.classList.remove("error");
  input.removeAttribute("aria-describedby");

  if (input.parentNode.classList.contains("datecol")) {
    const hasError = input.parentNode.querySelector(".error");
    if (hasError) {
      return;
    } else {
      input.parentNode.classList.remove("error");
    }
  }
  const id = input.parentNode.classList.contains("datecol")
    ? "datecol"
    : input.id;

  const message = input.form.querySelector(`.error-message#error-for-${id}`);
  if (!message) return;

  message.style.innerHTML = "";
  message.style.display = "none";
  message.style.visibility = "hidden";
};

const thankyou = document.querySelector(".thankyou");

document.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    let hasErrors = false;
    for (const input of event.target.elements) {
      var error = hasError(input);

      if (error) {
        showError(input, error);
        hasErrors = true;
      } else {
        removeError(input);
      }
    }

    if (hasErrors) {
      return;
    }

    const form = event.target;
    form.style.display = "none";
    thankyou.style.display = "flex";
  },
  false
);

function formatCreditCardNumber(num) {
  num = num.split(" ").join("");
  let arr = num.split("");
  let formattedNum = [];
  if (arr.length < 4) return num;

  for (let i = 0; i < arr.length; i++) {
    if (i !== 0 && i % 4 === 0) {
      formattedNum.push(" ");
    }

    formattedNum.push(arr[i]);
  }

  return formattedNum.join("");
}

// Card Name
const cardName = document.getElementById("frontcardname");
const cardNameInput = document.getElementById("name");
cardNameInput.addEventListener("input", function (event) {
  cardName.innerHTML = this.value.length > 0 ? this.value : "Jane Appleseed";
});

// Card Number
const cardNumber = document.getElementById("cardnumber");
const cardNumInput = document.getElementById("number");
cardNumInput.addEventListener("input", function (event) {
  this.value = formatCreditCardNumber(this.value);
  cardNumber.innerHTML =
    this.value.length > 0 ? this.value : "0000 0000 0000 0000";
});

// Expiration Date
const expDate = document.querySelector(".end");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
monthInput.addEventListener("input", function (event) {
  expDate.innerHTML =
    this.value.length > 0
      ? `${this.value}/${expDate.innerHTML.split("/")[1]}`
      : "00/00";
});
yearInput.addEventListener("input", function (event) {
  expDate.innerHTML =
    this.value.length > 0
      ? `${expDate.innerHTML.split("/")[0]}/${this.value}`
      : "00/00";
});

// CVC
const cvc = document.querySelector(".backtext");
const cvcInput = document.getElementById("cvc");
cvcInput.addEventListener("input", function (event) {
  cvc.innerHTML = this.value.length > 0 ? this.value : "000";
});
