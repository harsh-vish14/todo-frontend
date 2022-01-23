let cameData = [];
const deleteToast = document.getElementById("liveToast-delete");
const updateToast = document.getElementById("liveToast-updated");
const customModel = document.getElementById("myModal");

document.getElementById("model-submit-btn").addEventListener("click", () => {
  updateItem();
});

document.getElementById("todo-add-submit").addEventListener("click", () => {
  submitTodoItem();
});

const submitTodoItem = async () => {
  const inputValue = document.getElementById("todo-add-input");
  if (!inputValue.value) {
    alert("todo cannot be empty");
    return;
  }
  const res = await fetch(`https://todo-backend-14.herokuapp.com/api/v1/`, {
    method: "POST",
    body: JSON.stringify({
      title: inputValue.value,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    inputValue.value = "";
    await getAllData();
  }
};

const updateItem = async () => {
  const itemTitle = document.getElementById("todo-title-text");
  const itemContent = document.getElementById("todo-content-text");
  var myModal = new bootstrap.Modal(customModel, {
    keyboard: false,
  });
  const currentId = customModel.getAttribute("current-model-id");

  const res = await fetch(
    `https://todo-backend-14.herokuapp.com/api/v1/${currentId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        title: itemTitle.value,
        content: itemContent.value,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    var toast = new bootstrap.Toast(updateToast);
    toast.show();
    await getAllData();
  }
  myModal.hide();
};

const clickedMe = async (i, id) => {
  var myModal = new bootstrap.Modal(customModel, {
    keyboard: false,
  });
  customModel.setAttribute("current-model-id", id);
  myModal.show();
  const textTitle = document.getElementById("todo-title-text");
  textTitle.value = cameData[parseInt(i)].title;
  const messageText = document.getElementById("todo-content-text");
  messageText.value = cameData[parseInt(i)].detail;
};

const deleteMe = async (index, id) => {
  cameData.splice(index, 1);
  generateItems(cameData);

  const res = await fetch(
    `https://todo-backend-14.herokuapp.com/api/v1/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (res.ok) {
    var toast = new bootstrap.Toast(deleteToast);
    toast.show();
    await getAllData();
  }
};

const checkedUp = async (id) => {
  const checkBox = document.getElementById(`check-box-${id}`);
  const itemBox = document.getElementById(`${id}`);
  const checked = document.getElementById("liveToast-checked");
  const unchecked = document.getElementById("liveToast-un-checked");
  if (!checkBox.checked) {
    itemBox.classList.remove("done");
    await fetch(`https://todo-backend-14.herokuapp.com/api/v1/not-done/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    var toast = new bootstrap.Toast(unchecked);
    toast.show();
  } else {
    itemBox.classList.add("done");
    await fetch(`https://todo-backend-14.herokuapp.com/api/v1/done/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    var toast = new bootstrap.Toast(checked);
    toast.show();
  }
};

const group = document.querySelector(".list-group");

const getAllData = async () => {
  const res = await fetch("https://todo-backend-14.herokuapp.com/api/v1/");
  const data = await res.json();
  cameData = data;
  generateItems(data);
};
getAllData();

const generateItems = (data) => {
  currentData = "";
  data.forEach((item, i) => {
    currentData += `<li class="list-group-item">
                <input class="form-check-input me-1" ${
                  item.done ? "checked" : ""
                } type="checkbox"  id='check-box-${
      item._id
    }' onclick="checkedUp('${item._id}')">
                <div onclick="clickedMe('${i}','${
      item._id
    }')" class="list-group-item-content ${item.done ? "done" : ""}" id="${
      item._id
    }">
                    ${item.title}
                </div>
                <div class="form-group-item-button">
                    <div class="todo-item-delete" onclick="deleteMe('${i}','${
      item._id
    }')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-trash-2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </div>
                    <div class="todo-item-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-arrow-right">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            </li>`;
  });
  group.innerHTML = currentData;
};
