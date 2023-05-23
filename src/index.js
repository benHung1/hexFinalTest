// const checkScore = (score) => {
//   return new Promise((resolve, reject) => {
//     if (score >= 70) {
//       resolve(score);
//     } else {
//       reject("再加油");
//     }
//   });
// };

// checkScore(80)
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

// Swal.fire({
//   title: "Error!",
//   text: "Do you want to continue",
//   icon: "error",
//   confirmButtonText: "Cool",
// });

// "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MjYzIiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNjg0MjI2MjA1LCJleHAiOjE2ODU1MjIyMDUsImp0aSI6IjcwY2EwZjNiLWY1NTgtNGMwZi1hODU5LTJjNWIwODU4NGE2NSJ9.fMkAbwVdUmziQm36SgbmGSLNi0mmRiRp95bt9jpaPxI"

const apiUrl = `https://todoo.5xcamp.us`;

const email = document.querySelector(".email");

const passWord = document.querySelector(".passWord");

const loginBtn = document.querySelector(".loginBtn");

const divContainer = document.querySelectorAll(".divContainer");

const signUpContainer = document.querySelector(".signUpContainer");

const loginContainer = document.querySelector(".loginContainer");

const signUpBtn = document.querySelector(".signUpBtn");

const title = document.querySelector(".title");

const form = document.querySelector(".form");

const inputs = form.querySelectorAll("input");

const btn = document.querySelectorAll(".btn");

const goSignUpBtn = document.querySelector(".goSignUpBtn");

const loginForm = document.querySelector(".loginForm");

const loginFormInputs = loginForm.querySelectorAll("input");

const todoListcontainer = document.querySelector(".todoListcontainer");

const nickNameTodoList = document.querySelector(".nickNameTodoList");

const addBtn = document.querySelector(".btn_add");

const addTodoInput = document.querySelector(".addTodoInput");

const list = document.querySelector(".list");

const tab = document.querySelectorAll(".tab > li");

const deleteAll = document.querySelector(".deleteAll");

let userName, token, data, listLi, tabNum, filterData, unfinishedData;

let isEditing = false;

addTodoInput.addEventListener("input", () => {
  if (addTodoInput.value === "") isEditing = false;
});

function checkToken() {
  token = localStorage.getItem("token");

  if (token) {
    showTodoList();
  }
}

checkToken();

function showBlock(e) {
  // show block

  divContainer.forEach((item) => {
    item.style.display = "none";
  });

  if (e.target.classList.contains("signUpBtn")) {
    // 註冊
    signUpContainer.style.display = "block";
  }
  // 登入
  else if (e.target.classList.contains("loginBtn")) {
    loginContainer.style.display = "block";
  } else if (e.target.classList.contains("logOutBtn")) {
    logOut();
  }

  loginForm.reset();
  form.reset();
}

function signUp(email, nickName, passWord) {
  let isChecked = false;

  // 檢查表單，有空白或錯誤先擋
  inputs.forEach((item) => {
    // 有表單空白
    if (item.value === "") {
      Swal.fire({
        title: "錯誤!",
        text: "請確實填寫所有表單內容",
        icon: "error",
        confirmButtonText: "知道了",
      });
    }
    // 兩次密碼不一致
    else if (passWord !== inputs[3].value.replace(/\s+/g, "")) {
      Swal.fire({
        title: "錯誤!",
        text: "兩次密碼輸入不一致，請重新輸入",
        icon: "error",
        confirmButtonText: "知道了",
      });
      // form.reset();
    }

    isChecked = true;
  });

  // 通過驗證的話打Api

  if (isChecked) {
    const user = {
      email: email,
      nickname: nickName,
      password: passWord,
    };

    axios
      .post(`${apiUrl}/users/`, {
        user,
      })
      .then((res) => {
        // 註冊成功轉回登入頁面

        Swal.fire({
          title: "成功!",
          text: "註冊成功，關閉後將為您導回登入頁面",
          icon: "success",
          confirmButtonText: "知道了",
        }).then(() => {
          form.reset();
          loginContainer.style.display = "block";
          signUpContainer.style.display = "none";
        });
      })
      .catch((error) => {
        console.log(error);
        // 錯誤的話
        Swal.fire({
          title: "錯誤!",
          text: error.response.data.error,
          icon: "error",
          confirmButtonText: "知道了",
        });

        form.reset();
      });
  }
}

function login(email, passWord) {
  axios
    .post(`${apiUrl}/users/sign_in`, {
      user: {
        email: email,
        password: passWord,
      },
    })
    .then((res) => {
      // 總是帶著token，不用每隻api都帶

      userName = res.data.nickname;

      token = res.headers.authorization;

      axios.defaults.headers.common["authorization"] =
        res.headers.authorization;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);

      // 登入成功轉回登入頁面

      Swal.fire({
        title: "成功!",
        text: "登入成功，關閉後將為您導回代辦事項頁面",
        icon: "success",
        confirmButtonText: "知道了",
      }).then(() => {
        form.reset();
        checkToken();
      });
    })
    .catch((error) => {
      console.log(error);
      // 錯誤的話
      Swal.fire({
        title: "錯誤!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "知道了",
      });

      form.reset();
    });
}

function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");

  Swal.fire({
    title: "成功!",
    text: "已登出，關閉後將為您導回登入頁面",
    icon: "success",
    confirmButtonText: "知道了",
  }).then(() => {
    loginContainer.style.display = "block";
    todoListcontainer.style.display = "none";
    loginForm.reset();
    delete axios.defaults.headers.common["authorization"];
  });
}

function showTodoList() {
  loginContainer.style.display = "none";
  todoListcontainer.style.display = "block";

  token = localStorage.getItem("token");

  const userName = localStorage.getItem("userName");

  let str = "";

  axios
    .get(`${apiUrl}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      data = res.data.todos;

      unfinishedData = data.filter((item) => item.completed_at === null);

      filterData = data.filter((item) => item.completed_at !== null);

      nickNameTodoList.innerText = `${userName}的代辦`;

      if (tabNum == 2) {
        filterData = data.filter((item) => item.completed_at !== null);

        data = filterData;
      } else if (tabNum == 1) {
        unfinishedData = data.filter((item) => item.completed_at === null);

        data = unfinishedData;
      }

      // renderData

      data.forEach((item) => {
        str += `
        <li data-num=${item.id} class="li flex items-center gap-4">
        <label class="checkbox" for="">
          <input type="checkbox" data-num=${item.id} ${
          item.completed_at === null ? "" : "checked"
        } />
          <span class="text">${item.content}</span>
        </label>
        <a href="#" class="edit" data-num=${item.id}></a>
        <a href="#" class="delete" data-num=${item.id}></a>
      </li>
        `;
      });

      list.innerHTML = str;

      // 刪除
      document.querySelectorAll(".delete").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          todoId = e.target.getAttribute("data-num");

          deleteTodolist(todoId);
        });
      });

      // 編輯
      document.querySelectorAll(".edit").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();

          addTodoInput.value = e.target
            .closest(".li")
            .querySelector("span").innerText;

          const content = addTodoInput.value;

          todoId = e.target.getAttribute("data-num");

          isEditing = true;

          // editTodoList(todoId, content);
        });
      });

      // 切換table
      listLi = list.querySelectorAll(".li");
      listLi.forEach((item) => {
        item.addEventListener("click", (e) => {
          let todoId = e.target.getAttribute("data-num");
          changeTodoListState(todoId);
        });
      });

      document.querySelector(
        ".notDoneList"
      ).innerText = `${unfinishedData.length} 個待完成項目`;
    })
    .catch((error) => {
      console.log(error.response);

      if (error.response.status === 401) {
        loginContainer.style.display = "block";
        todoListcontainer.style.display = "none";
      }
    });
}

showTodoList();

function addTodoList(content) {
  if (isEditing) {
    editTodoList(todoId, content);
  } else {
    axios
      .post(
        `${apiUrl}/todos`,
        {
          todo: {
            content: content,
          },
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((res) => {
        tab[0].click();

        showTodoList();
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  addTodoInput.value = "";
}

function editTodoList(todoId, content) {
  axios
    .put(
      `${apiUrl}/todos/${todoId}`,

      {
        todo: {
          content: content,
        },
      },
      {
        headers: {
          authorization: token,
        },
      }
    )
    .then((res) => {
      isEditing = false;
      showTodoList();
    })
    .catch((error) => {
      console.log(error.response);
    });
}

function deleteTodolist(todoId) {
  Swal.fire({
    text: "確定要刪除該筆資料嗎?",
    icon: "warning",
    confirmButtonText: "確定",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`${apiUrl}/todos/${todoId}`, {
          headers: {
            authorization: token,
          },
        })
        .then((res) => {
          console.log(res);
          showTodoList();
        })
        .catch((error) => {
          console.log(error.response);
        });
    } else if (result.isDismissed) {
      return false;
    }
  });
}

function deleteAllFinished() {
  if (filterData.length === 0) {
    Swal.fire({
      text: "目前沒有已完成項目",
      icon: "warning",
      confirmButtonText: "確定",
    });
  } else {
    Swal.fire({
      text: "確定要刪除所有已完成資料嗎?",
      icon: "warning",
      confirmButtonText: "確定",
    }).then((result) => {
      if (result.isConfirmed) {
        filterData.forEach((item) => {
          todoId = item.id;

          axios
            .delete(`${apiUrl}/todos/${todoId}`, {
              headers: {
                authorization: token,
              },
            })
            .then((res) => {
              showTodoList();
            })
            .catch((error) => {
              console.log(error.response);
            });
        });
      } else if (result.isDismissed) return false;
    });
  }
}

function changeTable() {
  tab.forEach((item) => {
    item.addEventListener("click", (e) => {
      tabNum = e.target.getAttribute("data-num");

      tab.forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");

      showTodoList();
    });
  });
}

function changeTodoListState(todoId) {
  axios
    .patch(`${apiUrl}/todos/${todoId}/toggle`, null, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      showTodoList();
      tab[0].click();
    })
    .catch((error) => {
      console.log(error.response);
    });
}

tab.forEach((item) => {
  item.addEventListener("click", changeTable());
});

loginBtn.addEventListener("click", () => {
  const email = loginFormInputs[0].value.replace(/\s+/g, "");
  const passWord = loginFormInputs[1].value.replace(/\s+/g, "");

  if (email === "" || passWord === "") {
    Swal.fire({
      text: "帳號或密碼不得為空",
      icon: "warning",
      confirmButtonText: "確定",
    });
  } else {
    login(email, passWord);
  }
});

goSignUpBtn.addEventListener("click", () => {
  const email = inputs[0].value.replace(/\s+/g, ""); // 取得 email 的值
  const nickName = inputs[1].value.replace(/\s+/g, ""); // 取得 nickname 的值
  const passWord = inputs[2].value.replace(/\s+/g, ""); // 取得 password 的值

  signUp(email, nickName, passWord);
});

addBtn.addEventListener("click", () => {
  const content = addTodoInput.value.replace(/\s+/g, "");

  if (content === "") {
    Swal.fire({
      text: "新增內容不得為空",
      icon: "error",
      confirmButtonText: "知道了",
    });
  } else {
    addTodoList(content);
  }
});

btn.forEach((item) => {
  item.addEventListener("click", showBlock);
});

deleteAll.addEventListener("click", deleteAllFinished);
