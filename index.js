var meetings = {};
function onDayClick(event) {
  //adding event handler for clicks on each day of the calendar
  //if a day is already selected (clicking on the same day, toggle the isSelected)
  if (event.currentTarget.classList.contains("isSelected")) {
    event.currentTarget.classList.remove("isSelected");
    document.querySelector("#newMeetingDay").innerText = "Click on a day";
    return;
  }
  var selectedDay = event.currentTarget.innerText;
  // setting the new meeting day to the selected day
  document.querySelector("#newMeetingDay").innerText = selectedDay;
  // since we want to have only a selected day at a time
  var prevSelected = document.querySelector(".isSelected"); //get previously selected day
  if (prevSelected !== null)
    //if there was a previously selected day
    prevSelected.classList.remove("isSelected"); //remove the class
  event.currentTarget.classList.add("isSelected"); //in any case, add the class to the day
  showAppointments(selectedDay);
}
function addMeeting() {
  //1) get the informations from the inputs (date, time, appointmant name)
  var meeting = {
    day: document.querySelector("#newMeetingDay").innerText,
    time: document.querySelector("#newMeetingTime").value,
    name: document.querySelector("#newMeetingName").value,
  };

  if (document.querySelector(".isSelected") === null) {
    //if no day is selected, stop execution
    console.log("please select a day before trying to add an event");
    return;
  }
  var isConflict = checkAppointmentConflict(meeting);
  if (!isConflict) {
    //if there is no conflict, I can add the appointment
    meetings[meeting.day].push(meeting);
    //3) display the information in a specific section
    showAppointments(meeting.day);
    //4) change the style of the day with appointments
    var day = parseInt(meeting.day); //converting the day in a number
    var currentDayCell = document.querySelectorAll(".day")[day - 1]; //using the number to access the direct cell
    currentDayCell.classList.add("withAppointments"); //adding a class
  }
}
function checkAppointmentConflict(meeting) {
  var meetingsForTheDay = meetings[meeting.day];
  for (var i = 0; i < meetingsForTheDay.length; i++) {
    //checking if there is another appointment for that hour
    var prevAppTime = meetingsForTheDay[i].time; //taking the time
    var hour = prevAppTime.split(":")[0]; //splitting out to take the hour
    //if (meeting.time.startsWith(hour + ":")) => same thing
    if (meeting.time.indexOf(hour + ":") === 0) {
      //checking if any of the appointments starts at the same hour
      var errorMessage = document.createElement("h2"); //if so, adding error message
      errorMessage.innerText = "Cannot add an appointment: you have " + meetingsForTheDay[i].name + " at the same time";
      document.querySelector("body").appendChild(errorMessage);
      return true;
    }
  }
  return false;
}
function showAppointments(day) {
  var meetingsForTheDay = meetings[day];
  if (meetingsForTheDay.length === 0) {
    //if no appointments
    document.querySelector("#appointments").style.display = "none"; //hide the appoints div
  } else {
    document.querySelector("#appointments").style.display = "block"; //make it visible
    var list = document.querySelector("#appointmentList");
    list.innerHTML = ""; //clear out previous appointments
    for (var i = 0; i < meetingsForTheDay.length; i++) {
      //loop for creating the <li>s
      var li = document.createElement("li"); //create an LI
      li.innerText = meetingsForTheDay[i].time + "- " + meetingsForTheDay[i].name; //set the content
      li.onclick = deleteAppointment;
      list.appendChild(li); //add the LI to the UL
    }
  }
}
function deleteAppointment(event) {
  //delete the meeting when clicking on it
  //1) remove the LI
  var currentLi = event.currentTarget;
  var time = currentLi.innerText.split("-")[0]; // get the time of the appoinment we have to delete
  //2) remove the appointment from our meetings object
  var currentDay = document.querySelector("#newMeetingDay").innerText; //in which day are we?
  var appointments = meetings[currentDay]; //getting the array of appointments for the day
  for (var j = 0; j < appointments.length; j++) {
    //for each appointment
    if (appointments[j].time == time) {
      //if the time of this appointment is the selected time
      appointments.splice(j, 1); //remove it from the array
      //if no more events for the day, just remove the class so that it will look like an empty cell
      if (appointments.length === 0) {
        //if we have no appointments left for the day
        var currentDayCell = document.querySelectorAll(".day")[currentDay - 1]; //using the number to access the direct cell
        currentDayCell.classList.remove("withAppointments"); //remove the class
      }
      showAppointments(currentDay); //update the list of appointments for today
      return;
    }
  }
}

window.onload = function() {
  //we get a reference to the calendar div
  var calendar = document.querySelector("#calendar");
  for (var i = 0; i < 30; i++) {
    //we add 30ish days to this specific calendar
    //1) create the div
    var cell = document.createElement("div");
    cell.className = "day";
    cell.onclick = onDayClick;
    //2) add a sub element h3 to the div
    var h3 = document.createElement("h3");
    h3.innerText = i + 1;
    cell.appendChild(h3);
    //3) append both to the DOM (calendar)
    calendar.appendChild(cell);
    meetings[i + 1] = [];
  }
};
