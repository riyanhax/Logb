window.addEventListener('load', (event) => {
    const token = sessionStorage.getItem('jwt-token');
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
        list_user = payload.data;
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

function renderPage(listUser = []){
    const table = document.querySelector(".user-table")
    let tbody = table.getElementsByTagName('tbody')[0];
    listUser.forEach(element => {
        
    });((user, ind) => {
        let row = (
            `<tr user_id="${user.id}">
            <td>${ind + 1}</td>
            
            <td class="text-truncate">${user.signup_data}</td>
            <td>${user.user_name}</td>
            <td class="text-truncate">${user.phone_number}</td>
            <td class="expiration-date text-truncate">
                <div class="d-flex">
                    ${(user.code) != null ? user.code : "Not active!"}
                    <a class="btn-action btn-remove text-danger close" data-toggle="tooltip" title="Delete User">×</a>
                </div>
            </td>
        </tr>`
        )
        tbody.innerHTML = row;
    });
};