async function setPhone() {
  await clickEl('[analyticsdetect="CustomerAction|Navigate|Task"]');
  await wait(1000);
  const selectTask = await setSelect("div.toolbar > ul > li > label > select:nth-of-type(1)", "Phone");

  const [dateString, timeString] = getDate();

  const dateInput = await setInput('[id^="mat-input-"]', dateString);
  const timeInput = await setInput("drc-time-input-searchable > div > label > input", timeString);

  if (selectTask.value.includes("Phone") && dateInput.value === dateString && timeInput.value === timeString) {
    const saveElement = await clickEl('[analyticsdetect="CustomerActions|Save|Task"]');
  }
}

function getDate() {
  let date = new Date();

  if (date.getHours() < 20) {
    date.setHours(date.getHours() + 3);
  } else {
    date.setDate(date.getDate() + 1);
    date.setHours(11, 0, 0, 0);
  }

  const minutes = date.getMinutes();
  const increment = 15;
  const roundedMinutes = Math.ceil(minutes / increment) * increment;
  date.setMinutes(roundedMinutes);
  const yearLastTwo = String(date.getFullYear()).slice(-2);
  const dateString = `${date.getMonth() + 1}/${date.getDate()}/${yearLastTwo}`;

  const hour12 = date.getHours() % 12 || 12;
  const timeString = `${hour12}:${String(date.getMinutes()).padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"}`;

  return [dateString, timeString];
}

async function setSelect(selector, optionText) {
  const selectElement = await waitForElement(selector);
  if (selectElement) {
    let option = Array.from(selectElement.options).find((opt) => opt.textContent.includes(optionText));
    if (option) {
      selectElement.value = option.value;
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      selectElement.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      console.log(`${optionText} was not found in "${selector}"`);
    }
    return selectElement;
  }
}

async function setInput(selector, text) {
  const inputField = await waitForElement(selector);
  if (inputField) {
    inputField.value = text;
    inputField.focus();
    inputField.dispatchEvent(new Event("change", { bubbles: true }));
    inputField.dispatchEvent(new Event("input", { bubbles: true }));
    inputField.blur();
    return inputField;
  } else {
    console.log(`"${selector}" field was not found.`);
  }
}

async function clickEl(selector) {
  const el = await waitForElement(selector);
  if (el) {
    el.click();
  } else {
    console.error("Element not found");
  }
}

async function waitForElement(selector, timeout = 5000) {
  const startTime = Date.now();

  while (document.querySelector(selector) === null) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Timeout waiting for ${selector}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return document.querySelector(selector);
}

async function wait(ms = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setPhone();
