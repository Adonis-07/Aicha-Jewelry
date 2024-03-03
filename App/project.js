function downloadText() {
  // Fetch the text content from the website
  const textContent = document.getElementById("text-content").innerText; // Adjust the selector as needed

  // Create a Blob object from the text content
  const blob = new Blob([textContent], { type: "text/plain" });

  // Create a temporary anchor element
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = "Font.ttf"; // Set the filename

  // Programmatically click the anchor to initiate download
  anchor.click();

  // Clean up
  URL.revokeObjectURL(anchor.href);
}

 // Check if the user is logged in
 var isLoggedIn = false; // Replace this with your actual login check

 // If the user is not logged in, redirect to the login page
 if (!isLoggedIn) {
     window.location.href = "login.html"; // Change "login.html" to the path of your login page
 } else
 return


var services = [];
var clientName = "";
var serviceTypeSelect = document.getElementById("service-type");
var otherServicesInput = document.getElementById("otherServicesInput");

// Attach change event listener to service-type select element
serviceTypeSelect.addEventListener("change", function() {
  var selectedService = serviceTypeSelect.value;
  // If the selected service is "آخر", display the hidden input field
  if (selectedService === "آخر") {
    otherServicesInput.style.display = "block";
    selectedService.value = otherServicesInput.value
  } else {
    otherServicesInput.style.display = "none";
  }
});


loadClientsTable();


function addClient() {
  clientName = document.getElementById("client-name").value;
  var clientNameInput = document.getElementById("client-name");


  if (clientNameInput.value === "") {
    Swal.fire({
    icon: 'warning',
    title: 'المرجو إضافة اسم العميل',
    showConfirmButton: false,
    timer : 3000
  });    return;   
  }
  document.getElementById("client-name").disabled = true;
  document.getElementById("add-client-btn").style.display = "none";
  document.getElementById("clients-table-container").style.display = "none";
  document.getElementById("bill-client-name").textContent = clientName;
  document.getElementById("print-button").disabled = true;

  generateBillCode();
  showServiceForm();
  document.getElementById("confirm-services-button").style.display = "none";
}

function showServiceForm() {
  document.getElementById("service-form").style.display = "block";
}

function addService() {
    var serviceType = document.getElementById("service-type").value;
    var metalType = document.getElementById("metal-type").value;
    var productType = document.getElementById("product-type").value;
    var weight = parseFloat(document.getElementById("weight").value);
    var customPrice = parseFloat(document.getElementById("custom-price").value);
    var servicePrice = calculateServicePrice(serviceType, metalType, productType, weight, customPrice);
    if (serviceType === "" || metalType === "" || productType === "" || isNaN(weight) || isNaN(customPrice)) {
      Swal.fire({
        icon: 'warning',
        title: 'المرجو ملء جميع تفاصيل الخدمة',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    // Update value of the hidden input field for other services
    if (serviceType === "آخر") {
      var otherServicesInput = document.getElementById("otherServicesInput");
      var otherServiceValue = otherServicesInput.value;
      serviceType === otherServiceValue.value;
      if (otherServiceValue === "") {
        Swal.fire({
          icon: 'warning',
          title: 'المرجو إدخال قيمة للخدمة الأخرى',
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
      // Update value of the hidden input field for other services
      otherServicesInput.value = otherServiceValue;
  
      // Update value of the hidden input field for other services in all service type tables
      var serviceTypeTables = document.querySelectorAll('.service-description-table input[type="text"]');
      serviceTypeTables.forEach(function (input) {
        if (input.id !== "otherServicesInput") {
          input.value = otherServiceValue;
        }
      });
    }
  
    services.push({
      serviceType: serviceType,
      metalType: metalType,
      productType: productType,
      weight: weight,
      servicePrice: servicePrice
    });
  
    // Save services to local storage
    saveServicesToLocalStorage();
    clearServiceForm();
    showServiceConfirmation(services[services.length - 1]);
    generateBill();
  
    if (services.length > 0) {
      document.getElementById("confirm-services-button").style.display = "flex";
    }
  }


function saveServicesToLocalStorage() {
  localStorage.setItem("services", JSON.stringify(services));
}


function clearServiceForm() {
  document.getElementById("service-type").value = "";
  document.getElementById("metal-type").value = "";
  document.getElementById("product-type").value = "";
  document.getElementById("weight").value = "";
  document.getElementById("custom-price").value = "";
}

function confirmServices() {
  if (services.length === 0) {
    Swal.fire({
    icon: 'danger',
    title: 'المرجو إضافة خدمة واحدة على الأقل',
    showClass: {
      popup: 'swal2-noanimation',
      backdrop: 'swal2-noanimation'
    },
    hideClass: {
      popup: '',
      backdrop: ''
    },
    showConfirmButton: false,
    timer: 3000
  });    return;
  }
  document.getElementById("service-form").style.display = "none";
  document.getElementById("confirm-services-button").style.display = "none";
  document.getElementById("bill-container").style.display = "block";
  document.getElementById("print-button").disabled = false;
   // Add client information to the Clients table
   var clientName = document.getElementById("client-name").value;
  var billCode = document.getElementById("bill-code").textContent;
  var totalAmount = document.getElementById("bill-total-amount").textContent;
  var currentDate = document.getElementById("bill-date").textContent;
  var serviceCount = services.length;
  var serviceStatus= "غير مكتملة";

  var clientsTable = document.getElementById("clients-table").getElementsByTagName("tbody")[0];
  var newRow = clientsTable.insertRow();

  var clientNameCell = newRow.insertCell();
  clientNameCell.textContent = clientName;

  var billCodeCell = newRow.insertCell();
  billCodeCell.textContent = billCode;

  var totalAmountCell = newRow.insertCell();
  totalAmountCell.textContent = totalAmount;

  var currentDateCell = newRow.insertCell();
  currentDateCell.textContent = currentDate;

  var serviceCountCell = newRow.insertCell();
  serviceCountCell.textContent = serviceCount;

  var serviceStatusCell = newRow.insertCell();
  serviceStatusCell.textContent = serviceStatus;

  var clientData = {
    clientName: clientName,
    billCode: billCode,
    totalAmount: totalAmount,
    currentDate: currentDate,
    serviceCount: serviceCount,
    serviceStatus: serviceStatus,
  };

  // Store client data in localStorage
  var clientsData = localStorage.getItem("clientsData");
  if (clientsData) {
    clientsData = JSON.parse(clientsData);
    clientsData.push(clientData);
  } else {
    clientsData = [clientData];
  }
  localStorage.setItem("clientsData", JSON.stringify(clientsData));
  document.getElementById("clients-table-container").style.display = "none";


}
function calculateServicePrice(serviceType, metalType, productType, weight, customPrice) {
  var price = customPrice;
  return price;
}

if (clientServicesTbody !== "") {
  clientStatus0.style.opacity = "0%";
} if (clientServicesTbody == "") {
  clientStatus0.style.opacity = "100%"; // Adjust the display value as needed
}

function generateBillCode() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth() + 1; // Months are zero-based
  var year = date.getFullYear();
  var randomCode = Math.floor(Math.random() * 100);

  var billCode =  day + "." + month + "." + year + "-" + randomCode.toString(9).padStart(2, "1");
  document.getElementById("bill-code").textContent = billCode;
}

function loadClientsTable() {
  var clientsTableContainer = document.getElementById("clients-table-container");
  var clientsTable = clientsTableContainer.querySelector("tbody");
  clientsTable.innerHTML = "";


  // Retrieve client data from localStorage
  var clientsData = localStorage.getItem("clientsData");
  if (clientsData) {
    clientsData = JSON.parse(clientsData);
    clientsData.reverse();
    clientsData.forEach(function (clientData, index) { // Added index parameter
      var newRow = clientsTable.insertRow();

      var clientNameCell = newRow.insertCell();
      clientNameCell.textContent = clientData.clientName;

      var billCodeCell = newRow.insertCell();
      billCodeCell.textContent = clientData.billCode;

      var totalAmountCell = newRow.insertCell();
      totalAmountCell.textContent = clientData.totalAmount;

      var currentDateCell = newRow.insertCell();
      currentDateCell.textContent = clientData.currentDate;

      var serviceCountCell = newRow.insertCell();
      serviceCountCell.textContent = clientData.serviceCount;

      var serviceStatusCell = newRow.insertCell();
      var serviceStatus = clientData.serviceStatus;

      var serviceStatusSelect = document.createElement("select");
      serviceStatusSelect.disabled = true;
      var options = [
        "غير مكتملة",
        "في طور الإنجاز",
        "مكتملة",
        "تسلمه الزبون"
      ];
      options.forEach(function (option) {
        var optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        serviceStatusSelect.appendChild(optionElement);
      });
      serviceStatusCell.appendChild(serviceStatusSelect);

      serviceStatusSelect.addEventListener("change", function () {
        serviceStatus = this.value;
      });

      var serviceStatus = clientData.serviceStatus;

      if (serviceStatus === "") {
        serviceStatusSelect.value = "غير مكتملة";
        serviceStatus = "غير مكتملة";
      } else {
        serviceStatusSelect.value = serviceStatus;
      }

      var editButton = document.createElement("button");
      editButton.innerHTML = `<i class="fas fa-pencil-alt"></i>`;
      editButton.classList = "edit-button";
      serviceStatusCell.appendChild(editButton);

      var confirmButton = document.createElement("button");
      confirmButton.innerHTML = `<i class="fa fa-check"></i>`;
      confirmButton.style.display = "none";
      serviceStatusCell.appendChild(confirmButton);
      confirmButton.classList = "confirm-button";

      editButton.addEventListener("click", function () {
        serviceStatusSelect.disabled = false;
        confirmButton.style.display = "inline-block";
        editButton.style.display = "none";
      });

      confirmButton.addEventListener("click", function () {
        Swal.fire({
          icon: 'success',
          title: 'الطلبية ' + serviceStatus,
          showConfirmButton: false,
          timer: 3000,
        });
      
        editButton.style.display = "inline-block";
        clientData.serviceStatus = serviceStatus;
        localStorage.setItem("clientsData", JSON.stringify(clientsData));
        serviceStatusSelect.disabled = true;
        confirmButton.style.display = "none";})

      
      var deleteCell = newRow.insertCell();
      var deleteButton = document.createElement("button");
      deleteButton.innerHTML = "حذف";
      deleteButton.classList.add("delete-button");
      deleteCell.appendChild(deleteButton);

// Add event listener to delete button
deleteButton.addEventListener("click", function () {
  var rowIndex = this.parentNode.parentNode.rowIndex; // Get the index of the row containing the delete button
  confirmAndDelete(rowIndex); // Call the confirmAndDelete function with the rowIndex
});

// Function to confirm and delete a row by index
function confirmAndDelete(rowIndex) {
  var confirmation = confirm("هل تريد حذف العميل وخدماته (حذف نهائي)");
  if (confirmation) {
    var table = document.getElementById("clients-table");
    table.deleteRow(rowIndex); // Delete the row from the table

    var clientsData = JSON.parse(localStorage.getItem("clientsData"));
    clientsData.splice(rowIndex - 1, 1); // Remove the corresponding data from the array

    localStorage.setItem("clientsData", JSON.stringify(clientsData)); // Update localStorage

    loadClientsTable(); // Refresh the table after deletion
  }
}

    })};

  var searchInput = document.getElementById("search-input");
  var searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", function () {
    var searchTerm = searchInput.value.trim().toLowerCase();
    filterClients(searchTerm);
  });

  function filterClients(searchTerm) {
    var rows = clientsTable.getElementsByTagName("tr");
    var foundRow = false;

    if (searchTerm === "") {
      for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = "table-row";
      }
      return;
    }

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];

      var billCodeCell = row.cells[1];
      var billCode = billCodeCell.textContent.trim().toLowerCase();

      if (billCode.includes(searchTerm)) {
        row.style.display = "table-row";
        foundRow = true;
      } else {
        row.style.display = "none";
      }
    }

    if (!foundRow) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "لم يتم العثور على عميل بهذا الرقم",
        confirmButtonText: "موافق",
      }).then(function () {
        for (var i = 0; i < rows.length; i++) {
          rows[i].style.display = "table-row";
        }
      });
    }
  }
// Add an event listener for the status buttons
var statusButtons = document.querySelectorAll(".status-button");

statusButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var status = button.getAttribute("data-status");
    var foundClients = filterClientsByStatus(status, button);

    // Remove the 'active' class from all buttons
    statusButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    // Add the 'active' class to the clicked button only if clients were found
    if (foundClients) {
      button.classList.add("active");
    }
  });
});

// Modify the filterClientsByStatus function
function filterClientsByStatus(status, button) {
  var rows = clientsTable.getElementsByTagName("tr");

  if (status === "all") {
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = "table-row";
    }
    return true; // Clients were found for 'all' status
  }

  var foundClients = false;

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];

    if (row.classList.contains("header-row")) {
      continue;
    }

    var serviceStatusCell = row.cells[5];
    var serviceStatus = serviceStatusCell.querySelector("select").value;

    if (serviceStatus === status) {
      row.style.display = "table-row";
      foundClients = true;
    } else {
      row.style.display = "none";
    }
  }

  if (!foundClients) {
    Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "لم يتم العثور على عملاء لهذا الحالة",
      confirmButtonText: "موافق",
    }).then(function () {
      for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = "table-row";
      }
      clientsTableContainer.style.display = "block";
    });
  } else {
    clientsTableContainer.style.display = "block";
  }

  return foundClients;
}

  
}

// Call the function to load the clients table

function generateBill() {
  var billItems = document.getElementById("bill-items");
  var billTotalAmount = document.getElementById("bill-total-amount");
  var billDate = document.getElementById("bill-date");
  var serviceDescription = document.getElementById("service-description").value; // Get the value of the service description textarea
  loadServicesFromLocalStorage();
  loadBillCodeFromLocalStorage();

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon: 'success',
    title: 'تمت إضافة الخدمة بنجاح'
  });

  // Get the current date and time
  var currentDate = new Date();

  // Set the options for date formatting
  var dateOptions = {
    weekday: 'long', // Display the full day name
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  // Format the date in Arabic
  var formattedDate = currentDate.toLocaleDateString('ar-EG-u-nu-latn', dateOptions);

  // Get the time components
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  var timeSuffix = hours < 12 ? 'صباحًا' : 'مساءًا';
  var formattedHours = hours % 12 || 12; // Convert to 12-hour format

  // Format the time in Arabic
  var formattedTime = formattedHours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + seconds + ' ' + timeSuffix;

  // Update the HTML elements with the formatted date and time
  billDate.textContent = formattedDate + ' ' + formattedTime;

  billItems.innerHTML = "";
  var totalAmount = "";

  services.forEach(function (service) {
    var serviceRow = document.createElement("tr");

    var serviceTypeCell = document.createElement("td");
    serviceTypeCell.textContent = service.serviceType;
    serviceRow.appendChild(serviceTypeCell);

    var metalTypeCell = document.createElement("td");
    metalTypeCell.textContent = service.metalType;
    serviceRow.appendChild(metalTypeCell);

    var productTypeCell = document.createElement("td");
    productTypeCell.textContent = service.productType;
    serviceRow.appendChild(productTypeCell);

    var weightCell = document.createElement("td");
    weightCell.textContent = service.weight;
    serviceRow.appendChild(weightCell);

    var priceCell = document.createElement("td");
    priceCell.textContent = priceCell.textContent + service.servicePrice + " درهم";
    serviceRow.appendChild(priceCell);

    billItems.appendChild(serviceRow);
    totalAmount = +totalAmount + +service.servicePrice;

  });

  billTotalAmount.textContent = totalAmount + " درهم";
  localStorage.setItem("billCode", billCode);
}

function loadServicesFromLocalStorage() {
  var storedServices = localStorage.getItem("services");

  if (storedServices) {
    services = JSON.parse(storedServices);

    // Check if services array is not empty
    if (services.length > 0) {
      document.getElementById("confirm-services-button").style.display = "flex";
    }
  }
}

function loadBillCodeFromLocalStorage() {
  var storedBillCode = localStorage.getItem("billCode");

  if (storedBillCode) {
    document.getElementById("bill-code").textContent = storedBillCode;
  }
}

// Call the function to check and delete rows




function showServiceConfirmation(service) {
  var confirmationTable = document.getElementById("confirmation-table");
  var confirmationTableBody = document.getElementById("confirmation-table-body");
  var totalAmountElement = document.getElementById("total-amount");
  var serviceCountElement = document.getElementById("service-count-number");

  var newRow = confirmationTableBody.insertRow();

  var serviceTypeCell = newRow.insertCell();
  serviceTypeCell.textContent = service.serviceType;

  var metalTypeCell = newRow.insertCell();
  metalTypeCell.textContent = service.metalType;

  var productTypeCell = newRow.insertCell();
  productTypeCell.textContent = service.productType;

  var weightCell = newRow.insertCell();
  weightCell.textContent = service.weight;

  var servicePriceCell = newRow.insertCell();
  servicePriceCell.textContent = servicePriceCell.textContent + service.servicePrice + " درهم";

  var billCodeCell = newRow.insertCell();
  billCodeCell.textContent = document.getElementById("bill-code").textContent;

  var currentDate = new Date();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  var timeSuffix = hours < 12 ? 'صباحًا' : 'مساءًا';
  var formattedHours = hours % 12 || 12; // Convert to 12-hour format
  var formattedTime = formattedHours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + seconds + ' ' + timeSuffix;

  var timeCell = newRow.insertCell();
  timeCell.textContent = formattedTime;

  confirmationTable.style.display = "block";
  

  // Update total amount
  var totalAmount = parseFloat(totalAmountElement.textContent);
  totalAmount += service.servicePrice;
  totalAmountElement.textContent = totalAmount;

  // Update service count
  var serviceCount = parseInt(serviceCountElement.textContent);
  serviceCount++;
  serviceCountElement.textContent = serviceCount;

  document.getElementById("service-client-name").textContent = document.getElementById("bill-client-name").textContent;
document.getElementById("service-bill-code").textContent = document.getElementById("bill-code").textContent;

}


// Call the function to load the clients' data on page load

function printBill() {
  window.addEventListener("beforeprint", function () {
  document.getElementById("print-button").style.display = "none";

  });

  var printContents = document.getElementById("bill-container").innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;

  // Print service description after printing the bill
  printServiceDescription();

  Swal.fire({
    icon: "success",
    title: "تمت الطباعة بنجاح!",
    showClass: {
      popup: "swal2-noanimation",
      backdrop: "swal2-noanimation",
    },
    hideClass: {
      popup: "",
      backdrop: "",
    },
    showConfirmButton: false,
    timer: 3000,
  });

  window.addEventListener("afterprint", function () {
    document.getElementById("print-button").style.display = "block";
    document.getElementById("return-button").style.display = "block";
    showClientForm();
  });
}

function printServiceDescription() {
  var serviceDescriptionContents = document.getElementById("service-description-container").innerHTML;
  var originalContents = document.body.innerHTML;


  document.body.innerHTML = serviceDescriptionContents;
  window.print();
  document.body.innerHTML = originalContents;
}
