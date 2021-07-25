window.addEventListener('load', (event) => {
    const page = document.querySelector(".admin-main__body");
    const token = sessionStorage.getItem('jwt-token-admin');
    
    if (!token){
        alert("Bạn chưa đăng nhập!");
        window.location.replace("/admin");
    }
    page.classList.add("d-flex");

    
    const headers = { 'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'};
    getData("api/user/all_user", headers)
    .then(res =>{
        if (!res.ok){
            let err = new Error(response.status)
            err.response = response.json()
            err.status = response.status
            throw err
        }
        return res.json();
    })
    .then( payload => {
        let list_user = payload.data;
        renderPage(list_user);
    })
    .catch(error => { console.error(error.response.message)});
});


function paginate(array, page_size, page_number){
    let pagination = {};
    pagination.total_pages = Math.ceil(array.length / page_size);
    pagination.data = array.slice((pagination.total_pages - 1) * page_size, pagination.total_pages * page_size);
    if (page_number > pagination.total_pages){
        pagination.current_page = pagination.total_pages;
        pagination.data = array.slice((pagination.total_pages - 1) * page_size, pagination.total_pages * page_size);
    }
    else{
        pagination.current_page = page_number;
        pagination.data = array.slice((page_number - 1) * page_size, page_number * page_size);
    }
    return pagination;
}

// function renderPagination(pagination){
//     let selectPageNumber = document.querySelector(".select-page-num");
//     let selectPageNum = document.querySelector(".select-rows-num");

//     selectPageNumber.innerHTML = "";
//     for (let i = 1; i <= pagination.total_pages; i++) {
//         if (i === pagination.current_page){
//             selectPageNum.append($('<option>', {value: i.toString(), text: i, selected: true}));
//         }
//         else{
//             selectPageNum.append($('<option>', {value: i.toString(), text: i}));
//         }
//     }

//     if (pagination.total_pages === 0) {
//         selectPageNum.append($('<option>', {value: "1", text: 1}));
//         document.querySelector(".show-page-1").text("Page: " + pagination.current_page + " / 1");
//     } else 
//         document.querySelector(".show-page-1").text("Page: " + pagination.current_page + " / " + pagination.total_pages);
// }



function renderPage(listUser = []){
    const table = document.querySelector(".user-table");
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    let listRows = ''
    listUser.forEach((user, ind) => {
        let row = (
            `<tr>
            <td>${ind + 1}</td>
            <td>${user.user_name}</td>
            <td class="text-truncate">${user.phone_number}</td>
            <td class="text-truncate">${user.signup_date}</td>
            <td class="text-truncate">${user.name_app}</td>
            <td class="text-truncate">
                ${user.code ? "Đã cấp" : "Chưa được cấp!"}
            </td>
            <td class="col-fit button-actions" user_id="${user.id}">
                <div class="d-sm-flex align-items-center">                    
                    <a class="btn-action btn-edit" data-toggle="tooltip" title="Add Code cho user"><i class="fa fa-pencil" aria-hidden="true"></i></a>
                    <a class="btn-action btn-remove text-danger close" data-toggle="tooltip" title="Xóa user">×</a>
                </div>
            </td>
        </tr>`
        )
        listRows += row;
        // tbody.innerHTML(row); 
        // console.log(row);
    });
    tbody.innerHTML = listRows;
    const listBtnEdit = tbody.querySelectorAll(".btn-edit");
    listBtnEdit.forEach(btn => btn.addEventListener("click", e => onEditCode(e, listUser)));
    const listBtnRemove = tbody.querySelectorAll(".btn-remove");
    listBtnRemove.forEach(btn => btn.addEventListener("click", e => onRemoveUser(e, listUser)));
};

const onEditCode = (e, listUser) => {
    const modal = document.querySelector("#user-code-modal");
    // const inputCode = this.modal.querySelector(".input-code");
    const btnAply = modal.querySelector(".btn-apply");
    
    const parentNode = e.target.parentNode.parentNode.parentNode;
    let user_id = parentNode.getAttribute("user_id");
    const args = {
        user_id: user_id,
        modal: modal,
        listUser: listUser
    }
    $(modal).modal("show");
    btnAply.addEventListener("click", e => onApplyCode(e, args));
}

const onRemoveUser = (e, listUser) => {
    const token = sessionStorage.getItem('jwt-token-admin');
    const headers = { 'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'};

    let user_id = e.target.parentNode.parentNode.getAttribute("user_id");
    payload = {
        user_id: user_id
    }

    let oldlistUser = listUser;
    
    deleteData("/api/user/me", payload, headers)
    .then(res =>{
        if (!res.ok){
        let err = new Error(response.status)
        err.response = response.json()
        err.status = response.status
        throw err
        }
        return res.json();
    })
    .then(res => {
        let listUser = oldlistUser.filter(user.id != user_id);
        renderPage(listUser);
    })
    .catch(err => alert("không delete được user!"))
}

function onApplyCode(e, args){
    const token = sessionStorage.getItem('jwt-token-admin');
    const headers = { 'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'};

    const inputCode = document.querySelector(".input-code");

    if (!inputCode.value){
        alert("Hãy nhập code cho user!");
        return;
    }

    payload = {
        user_id: args.user_id,
        code: inputCode.value
    }

    updateData("/api/user/code", payload, headers)
    .then(res =>{
        if (!res.ok){
            let err = new Error(response.status)
            err.response = response.json()
            err.status = response.status
            throw err
        }
        return res.json();
    }
    ).then(
        res => {
            $(args.modal).modal("hide");
            const index = args.listUser.findIndex(user => user.id == res.data.id);
            args.listUser[index].code = res.data.code;
            renderPage(args.listUser);
            alert("add code thành công!");
        }
    )
    .catch(err => alert("không add được code!"));
}