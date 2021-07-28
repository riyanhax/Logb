window.addEventListener('load', (event) => {   
    let page = new AdminManagement();
    page.initPage();
});

class AdminManagement{
    constructor(){
        this.page = document.querySelector(".admin-main__body");
        this.userList = [];
        this.userListFilter = [];
        this.selected_id = null;

        this.inputSearch = this.page.querySelector("#input-search");
        this.selectPageNum = this.page.querySelector(".select-page-num");
        this.selectRowsNum = this.page.querySelector(".select-rows-num");
        this.btnNextPage = this.page.querySelector(".btn-next-page");
        this.btnPrevPage = this.page.querySelector(".btn-prev-page");
        this.btnAddMW = this.page.querySelector(".btn-add-new");
        this.modalEdit = document.querySelector("#user-code-modal");
        this.modalNewUser = document.querySelector("#new-user-modal");
        this.btnAplyEdit = this.modalEdit.querySelector(".btn-apply--edit");
        this.btnSaveuser = this.modalNewUser.querySelector(".btn-save--user");

        this.inputSearch.addEventListener("input", this.onSearchCriteriaChange.bind(this));
        this.selectPageNum.addEventListener("change", this.onSearchCriteriaChange.bind(this));
        this.selectRowsNum.addEventListener("change", this.onSelectRowsNumChange.bind(this));
        this.btnNextPage.addEventListener("click", this.onBtnNextPageClick.bind(this));
        this.btnPrevPage.addEventListener("click", this.onBtnPrevPageClick.bind(this));
        this.btnAddMW.addEventListener("click", this.showUserModal.bind(this));
        this.btnAplyEdit.addEventListener("click", this.onApplyCode.bind(this));
        this.btnSaveuser.addEventListener("click", this.onAddNewUser.bind(this));
    }

    onAddNewUser(){
        let payload = {
            phone_number: this.modalNewUser.querySelector('.phone-new').value,
            user_name: this.modalNewUser.querySelector('.name-new').value,
            password: this.modalNewUser.querySelector('.pwd-new').value,
            imgID: this.modalNewUser.querySelector('.web-new').value,
            code: this.modalNewUser.querySelector('.code-new').value
        }

        postData("/api/user/register", payload)
        .then((response)=> {
            if (!response.ok){
                let err = new Error(response.status)
                err.response = response.json()
                err.status = response.status
                throw err 
            }
            return response.json()
        })
        .then(res => {
            alert("Đăng ký thành công");
            $(this.modalNewUser).modal('hide');
            this.userList.push(res.data);
            this.renderUserList(this.userList);            
        })
        .catch((error) => {
            if ((error.status >= 400) || (error.status < 500)){
                alert("Đăng ký không thành công!");
                $(this.modalNewUser).modal('hide');
            }
        });
    }

    showUserModal(){

        $(this.modalNewUser).modal('show');
    }

    onSearchCriteriaChange(userList){
        let searchValue = this.inputSearch.value;
        let data = userList || this.userListFilter.list;
        let pageSize = parseInt(this.selectRowsNum.value) || 0;
        let pageNum = parseInt(this.selectPageNum.value) || 0;

        if (searchValue != "")
            data = this.userListFilter.search(searchValue);
        else
            data = this.userListFilter.list;

        this.pagination = this.paginate(data, pageSize, pageNum)

        this.renderUser(this.pagination.data);
        this.renderPagination(this.pagination);
    }

    renderPagination(pagination){
        this.selectPageNum.innerHTML = "";

        let option = null;
        for (let i = 1; i <= pagination.total_pages; i++) {
            let option = document.createElement('option')
            option.value = i.toString();
            option.text = i;
            if (i === pagination.current_page){
                option.selected = true;
            }
            option.innerHTML = i
            this.selectPageNum.appendChild(option);
        }

        
        if (pagination.total_pages === 0) {
            let option = document.createElement('option')
            option.value = '1';
            option.text = 1;
            option.innerHTML = 1
            this.selectPageNum.appendChild(option);
            this.page.querySelector(".show-page-1").innerHTML = "Page: " + pagination.current_page + " / 1";
        } else 
        this.page.querySelector(".show-page-1").innerHTML = "Page: " + pagination.current_page + " / " + pagination.total_pages;
    }

    onSelectRowsNumChange() {
        this.selectPageNum.val(1);
        this.onSearchCriteriaChange();
    }

    onBtnNextPageClick(e) {
        let nextPage = (parseInt(this.selectPageNum.value) || 0) + 1;
        if (nextPage > this.pagination.total_pages)
            return;
        
        this.selectPageNum.val(nextPage).toString();

        this.onSearchCriteriaChange();
    }

    onBtnPrevPageClick(e) {
        let prevPage = (parseInt(this.selectPageNum.value)) || 0 - 1;
        if (prevPage < 1)
            return;
        
        this.selectPageNum.val(prevPage).toString();

        this.onSearchCriteriaChange();
    }

    initPage(){
        const token = sessionStorage.getItem('jwt-token-admin');
    
        if (!token){
            alert("Bạn chưa đăng nhập!");
            window.location.replace("/bennbeckman");
        }
        this.page.classList.add("d-flex");

        const headers = { 'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'};
        getData("/api/user/all_user", headers)
        .then(res =>{
            if (!res.ok){
                let err = new Error(response.status)
                err.response = response.json()
                err.status = response.status
                throw err
            }
            return res.json();
        })
        .then(this.getAllUser.bind(this))
        // .catch(error => { console.error(error.response.message)});

    }

    getAllUser(res){
        let data = res.data;
        this.renderUserList(data);
    }

    renderUserList(data){
        this.userList = data;
        this.userListFilter = new Fuse(data, {
            keys: ["user_name", "phone_number", "signup_date", "name_app"],
            threshold: 0.1
        });

        this.pagination = this.paginate(data, PaginationValue.DEFAULT_PAGE_SIZE, Math.ceil(data.length / PaginationValue.DEFAULT_PAGE_SIZE));
        this.renderPagination(this.pagination);
        this.onSearchCriteriaChange(data);
    }

    paginate(array, page_size, page_number){
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
    
    renderUser(listUser = []){
        let data = listUser || this.userList;
        const table = document.querySelector(".user-table");
        let tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        let listRows = ''
        data.forEach((user, ind) => {
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
        listBtnEdit.forEach(btn => btn.addEventListener("click", this.onEditCode.bind(this)));
        const listBtnRemove = tbody.querySelectorAll(".btn-remove");
        listBtnRemove.forEach(btn => btn.addEventListener("click", this.onRemoveUser.bind(this)));
    }

    onEditCode(e){        
        const parentNode = e.target.parentNode.parentNode.parentNode;
        this.selected_id = parentNode.getAttribute("user_id");
        // const args = {
        //     user_id: user_id,
        //     modal: modal,
        //     listUser: listUser
        // }
        $(this.modalEdit).modal("show");
        // btnAply.addEventListener("click", e => onApplyCode(e, args));
    }

    onApplyCode(e){
        const token = sessionStorage.getItem('jwt-token-admin');
        const headers = { 'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'};
    
        const inputCode = document.querySelector(".input-code");
    
        if (!inputCode.value){
            alert("Hãy nhập code cho user!");
            return;
        }
    
        let payload = {
            user_id: this.selected_id,
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
                $(this.modalEdit).modal("hide");
                const index = this.userList.findIndex(user => user.id == payload.user_id);
                this.userList[index].code = payload.code;
                this.renderUserList(this.userList);
                alert("add code thành công!");
            }
        )
        .catch(err => alert("không add được code!"));
    }

    onRemoveUser(e) {
        const token = sessionStorage.getItem('jwt-token-admin');
        const headers = { 'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'};
    
        let user_id = e.target.parentNode.parentNode.getAttribute("user_id");
        let payload = {
            user_id: user_id
        }
        
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
            this.userList = this.userList.filter(user.id != user_id);
            this.renderUserList(this.userList);
        })
        .catch(err => alert("không delete được user!"))
    }
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


// const onEditCode = (e, listUser) => {
//     const modal = document.querySelector("#user-code-modal");
//     const btnAply = modal.querySelector(".btn-apply--edit");
    
//     const parentNode = e.target.parentNode.parentNode.parentNode;
//     let user_id = parentNode.getAttribute("user_id");
//     const args = {
//         user_id: user_id,
//         modal: modal,
//         listUser: listUser
//     }
//     $(modal).modal("show");
//     // btnAply.addEventListener("click", e => onApplyCode(e, args));
// }

// const onRemoveUser = (e, listUser) => {
//     const token = sessionStorage.getItem('jwt-token-admin');
//     const headers = { 'Authorization': 'Bearer '+token,
//     'Content-Type': 'application/json'};

//     let user_id = e.target.parentNode.parentNode.getAttribute("user_id");
//     payload = {
//         user_id: user_id
//     }

//     let oldlistUser = listUser;
    
//     deleteData("/api/user/me", payload, headers)
//     .then(res =>{
//         if (!res.ok){
//         let err = new Error(response.status)
//         err.response = response.json()
//         err.status = response.status
//         throw err
//         }
//         return res.json();
//     })
//     .then(res => {
//         let listUser = oldlistUser.filter(user.id != user_id);
//         renderPage(listUser);
//     })
//     .catch(err => alert("không delete được user!"))
// }
