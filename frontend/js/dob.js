const selectDay = document.querySelector("#select-day");
const selectYear = document.querySelector("#select-year");
const selectMonth = document.querySelector("#select-month");

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(month, year) {
  if (!month) return 31;
  if (!year && month === 2) return 29;
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

function displayDays(month, selecteDay, year) {
  const daysInMonth = getDaysInMonth(month, year);

  selectDay.innerHTML = `<option class="text-gray-400" value=''>Day</option>`;

  for (let i = 1; i <= daysInMonth; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;

    if (i == selecteDay) {
      option.selected = true;
    }
    selectDay.appendChild(option);
  }
}

function displayYears(month, day) {
  let currentYear = parseInt(selectYear.value)
  if (month === 2 && day === 29) {
    selectYear.innerHTML = `<option class="text-gray-400" value=''>Year</option>`;
    for (let i = new Date().getFullYear(); i >= 1900; i--) {
      if (isLeapYear(i)) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;

        if(i == currentYear) option.selected = true;

        selectYear.appendChild(option);
      }
    }
  } else {
    selectYear.innerHTML = `<option class="text-gray-400" value=''>Year</option>`;
    for (let i = new Date().getFullYear(); i >= 1900; i--) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;

      if(i == currentYear) option.selected = true;

      selectYear.appendChild(option);
    }
  }
}

selectMonth.addEventListener("change", (e) => {
  const month = parseInt(e.target.value);
  const day = parseInt(selectDay.value);
  const year = parseInt(selectYear.value);

  displayDays(month, day, year);
  displayYears(month, day);
})

selectDay.addEventListener("change", (e) => {
  const day = parseInt(e.target.value);
  const month = parseInt(selectMonth.value);

  displayYears(month, day);
})

selectYear.addEventListener("change", (e) => {
  const year = parseInt(e.target.value);
  const month = parseInt(selectMonth.value);
  const day = parseInt(selectDay.value);

  displayDays(month, day, year);
})


