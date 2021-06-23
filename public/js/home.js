
var socket = io();
var page = 1;
var isIncreasePage = true;

//============================================================================================================
//---------------------------------------Function store html code-------------------------------------------------
//============================================================================================================

//code html render ra li ben phai cho user
function htmlTotalUser(username, nickname, avatar){ //bên phải
    return `
     <li class="list-group-item list-group-item-success d-flex" data-name="${username}">
        <img class="avatar avatar-32" src="${avatar}">
         <span class="text-nickname" style="font-size: 24px">${nickname}</span>
         <div class="dropdown ml-auto">
             <button class="btn btn-secondary dropdown-toggle" type="button" id="right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
             <div class="dropdown-menu" aria-labelledby="right">
                 <button class="add-chat-list dropdown-item" type="button">Thêm</button>
             </div>
         </div>
     </li>
`
}
//html render li ben phai cho group
function htmlToTalGroup(name, idRoom, avatar){
    return `
    <li class="list-group-item list-group-item-success d-flex" data-idRoom=${idRoom}>
        <img class="avatar avatar-32" src="${avatar}">
        <span class="text-nickname" style="font-size: 24px">${name}</span>
        <div class="dropdown ml-auto">
            <button class="btn btn-secondary dropdown-toggle" type="button" id="right" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <div class="dropdown-menu" aria-labelledby="right">
                <button class="add-chat-list-group dropdown-item" type="button">Thêm</button>
            </div>
        </div>
    </li>
    `
}

//code html render ra li ben trai cho user
function htmlCheckedUser(receiver, nickname, id, avatar, isOnline){ //bên trái
    var html = `<li class="list-chat-user-item list-group-item list-group-item-info d-flex" data-name="${receiver}" data-id="${id}" data-nickname="${nickname}">`
    if (isOnline){
        html += `<i class="fas fa-circle circle online"></i>`;
    }else{
        html += `<i class="fas fa-circle circle"></i>`;
    }
    html += `
    <img class="avatar avatar-32" src="${avatar}">
         <span class="text-nickname" style="font-size: 24px">${nickname}</span>
            <div class="dropdown ml-auto">
                 <button class="btn btn-secondary dropdown-toggle" type="button" id="left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                 <div class="dropdown-menu" aria-labelledby="left">
                    <button class="hide-chat-list dropdown-item" type="button">Ẩn</button>
                    <button class="create-group-chat dropdown-item" type="button">Tạo nhóm chat</button>
                    <button class="add-group-chat dropdown-item" type="button">Thêm thành viên</button>
                 </div>
             </div>
         </li>`
    return html;

}

//render thẻ li bên trái cho group
function htmlCheckedGroup(name, idRoom, avatar, isOnline){ //bên trái
    var html = ` <li class="list-chat-user-item list-group-item list-group-item-info d-flex" data-id="${idRoom}" data-nickname="${name}">`
    if (isOnline) html += `<i class="fas fa-circle circle online"></i>`
    else html += `<i class="fas fa-circle circle"></i>`;
    html+=`
            <img class="avatar avatar-32" src="${avatar}">
            <span class="text-nickname" style="font-size: 24px">${name}</span> 

            <div class="dropdown ml-auto">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="left" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                <div class="dropdown-menu" aria-labelledby="left">
                <button class="hide-chat-list dropdown-item" type="button">Ẩn</button>
                <button class="add-users-to-group dropdown-item" type="button">Thêm thành viên</button>
                </div>
             </div>
         </li>
    `
    return html;
}
function formatDate(date){
    if (typeof(date) == 'string'){
        return new Date(date)
    }else if (!date){
        return new Date();
    }else{
        return date;
    }
}


function calcDate(date){
    date = formatDate(date);
    var result = `${date.getHours()}:${formatMinute(date.getMinutes())} `;
    var now = new Date();
    if (now.getDay() === date.getDay() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()){
        result += 'Today';
    }else if (now.getDay() === date.getDay() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()){
        result += 'Yesterday';
    }else{
        result += `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return result;
}


function htmlTimeLine(date){
    var time = calcDate(date);
    console.log(time)
    return `
        <div class="time-line">
            <span class="line-start"></span>
            <span class="translate-date">${time}</span>
            <span class="line-end"></span>
        </div>
    `
}

//render message
async function htmlMessage(sender, message, date, isShowTime){
    var currentUser = await getCurrentUser();
    var username = await getUserByUsername(sender)

    date = formatDate(date);

    var minutes = date.getMinutes();
    minutes = formatMinute(minutes)

    var html = '';

    html += (currentUser.username !== sender) ? '<li class="message">' : '<li class="message message--reverse">';
    html += `<div class="message__avatar">`
    html += (isShowTime) ? `<img src="${username.avatar}" alt="" class="avatar avatar-16">` : '';
    html += `</div>
            <div class="message__content">
                <span class="message__content-name ">${username.nickname}</span>
                <span class="message__content-message">${message}</span>`
    html += (isShowTime) ? `<span class="message__content-time">${date.getHours()}:${minutes}</span>` : '';
    html += ' </div></li>'
    
    return html

}


//render item cho user ở dưới trong dialog craete group
async function htmlUserDialog(name, nickname, avatar, isChecked, isDisable){
    var {username} = await getCurrentUser();
    var html = '';
    if (name != username){//khong render ra chin minh
        html += `<div class="dialog__choose-item">
                    <input type="checkbox" name="" id="" class="dialog__choose-item-input" data-name="${name}"`
        
        if (isChecked) html += ' checked'
        if (isDisable) html += ' disabled'

        html += `>
            <img class="avatar avatar-16" src="${avatar}">
            
            <label class="dialog__choose-item-label">${nickname}</label>
                </div>`
        return html;
    }
}

//render ra user đã chọn ở trên dialog create group
async function htmlCheckedUserDialog(name, nickname, avatar){
    var {username} = await getCurrentUser();
    
    if (name === username){//khong render dau X
        return `
        <div class="dialog__choose-checked-item" data-name="${name}">
            <div class="fake-padding">
                <img class="avatar avatar-16" src="${avatar}">
                <span class="dialog__choose-checked-item-name">${nickname}</span>
            </div>
        </div>
    `
    }
    return `
        <div class="dialog__choose-checked-item" data-name="${name}">
            <div class="fake-padding">
                <img class="avatar avatar-16" src="${avatar}">
                <span class="dialog__choose-checked-item-name">${nickname}</span>
                <div class="container-close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>
    `
}


function htmlGroupCheckedAddUserToGroups(idRoom, name, avatar){
    
    return `
        <div class="dialog__choose-checked-item group-selected" data-idroom="${idRoom}">
            <div class="fake-padding">
                <img class="avatar avatar-16" src="${avatar}">
                <span class="dialog__choose-checked-item-name">${name}</span>
                <div class="container-close remove-group">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>
    `
}

function htmlGroupAddUserToGroups(name, idRoom, avatar, isDisable){
    if (isDisable){
        return `
        <div class="dialog__choose-item">
            <input type="checkbox" name="" id="" class="dialog__choose-item-input checkbox-select-group" data-idroom="${idRoom}" disabled>
            <img class="avatar avatar-16" src="${avatar}">
            <label for="" class="dialog__choose-item-label">${name}</label>
        </div>
    `
    }
    return `
        <div class="dialog__choose-item">
            <input type="checkbox" name="" id="" class="dialog__choose-item-input checkbox-select-group" data-idroom="${idRoom}">
            <img class="avatar avatar-16" src="${avatar}">
            <label for="" class="dialog__choose-item-label">${name}</label>
        </div>
    `
}
function htmlThreadChatPersonal(name, avatar){
    return `
        <h3 id="name-room">
            <img class="avatar avatar-32" src="${avatar}">
            <span>${name}</span>
            <span id="edit-name" class="edit-name">
                <i class="fas fa-user-edit"></i>
            </span>
        </h3>

        <div id="container-change-name" hidden>
            <input type="text" id="input-change-name" class="input-change-text">
            <span id="submit-change-name">
                <i class="fas fa-check"></i>
            </span>
        </div>  
    `
}

function htmlThreadChatGroup(name, count, avatar){
    return `
        <h3 id="name-room">
            <div class="d-flex justify-content-between">
                <div>
                <img class="avatar avatar-32" src="${avatar}">

                    <span>${name}</span>
                    <span id="edit-name" class="edit-name click">
                        <i class="fas fa-user-edit"></i>
                    </span>
                </div>
                <div class="click" id="icon-setting">
                    <i class="fas fa-cog "></i>
                </div>
            </div>
        </h3>
        <div id="container-change-name" hidden>
            <input type="text" id="input-change-name" class="input-change-text">
            <span id="submit-change-name">
                <i class="fas fa-check"></i>
            </span>
        </div>   

        <span>${count} thành viên</span>
         `
}

function htmlInputChangeName(){
    return `
        <div id="input-change-name">
            <input type="text" class="input-change-text">
            <span id="submit-change-name">
                <i class="fas fa-check"></i>
            </span>
        </div>  
    `
}

async function htmlUserInRoom(username, nickname, avatar, isHost){
    var currentUser = await getCurrentUser()
    var html = `
        <div class="list-user-item" data-name="${username}">
            <div>
                <img class="avatar avatar-16" src="${avatar}">
                <span class="dialog-name">${nickname}</span>
            </div>
            <div>
    `
    if (username != currentUser.username && isHost){
        html += `<button class="dialog__footer-btn kick-dialog-list-user create click">Đá</button>
        <button class="dialog__footer-btn appoint-admin create click">Bổ nhiệm QTV</button>`;
    }
    if (username != currentUser.username){
        html += `<button class="dialog__footer-btn inbox-dialog-list-user create click">Nhắn tin</button>`

    }
    if (username == currentUser.username){
        html += `<button class="dialog__footer-btn leave-group create click">Rời khỏi nhóm</button>`
    }

    html += `</div></div>`
    return html;
}

//render message
async function htmlMessageCantFind(){
    //thay đổi style để dể nhìn người nhận người gữi
    return `<li class="list-group-item list-group-item-danger list-group-message message-item"
    style="margin-left:auto; margin-right: auto">Không thể tìm thấy</li>`
}

function htmlDialogCreateGroup(){
    return `
    <div class="dialog" id="dialogCreateGroup">
        <div class="dialog__header">
            <span class="dialog__header-title">Tạo nhóm</span>
            <div class="dialog__header-close" id="headerIconCloseCreateGroup"><i class="fas fa-times"></i></div>
        </div>

        <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__name">
            <span class="dialog-title">Tên nhóm</span>
            <input type="text" id="name-group" class="dialog__name-input" placeholder="Nhập tên nhóm">       
            <span class="dialog-message"></span>

        </div>

        <div class="dialog__name">
            <span class="dialog-title">Ảnh đại diện</span>
            <input type="file" class="" id="avatar" name="avatar">
            <span class="dialog-message"></span>
        </div>


        <div class="dialog__group">
            <span class="dialog-title" id="count-user-checked">Mời thêm bạn vào cuộc trò chuyện</span>
            <input type="text" class="dialog__group-input" placeholder="Nhập tên muốn tìm" id="filterCreateGroup">      
            <span class="dialog-message"></span>

        </div>

        <div class="dialog__option" id="filter-user-create-group">
            <div class="dialog__option-container filter-user-dialog" data-option="all">
            <div class="fake-padding">
                <span class="dialog__option-text">Tất cả</span>
            </div>
            </div>
            <div class="dialog__option-container filter-user-dialog active" data-option="in_list">
            <div class="fake-padding">
                <span class="dialog__option-text">Đang trò chuyện</span>
            </div>
            </div>
            <div class="dialog__option-container filter-user-dialog" data-option="checked">
            <div class="fake-padding">
                <span class="dialog__option-text">Đã chọn</span>
            </div>
            </div>
            
        </div>

        <div class="dialog__choose">
            <span class="dialog-title" id="titleSelectedCreateGroup">Đã chọn</span>
            <div class="dialog__choose-checked" id="selectedCreateGroup"></div>
            <span class="dialog-title">Trò chuyện gần đây</span>
            <div class="dialog__choose-list" id="userCreateGroup">
            /api/user-by-username/
            </div>
        </div>
        <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__footer">
            <div class="dialog__footer-container">
            <button class="dialog__footer-btn cancel" id="btnCloseCreateGroup">Hủy</button>
            <button type="submit" class="dialog__footer-btn create" id="btn-create-group-chat">Tạo nhóm</button>
            </div>
        </div>
    </div>
    <div class="overlay"></div>
    `
}

function htmlDialogAddUserToGroups(){
    return `
    <div class="dialog" id="dialogAddUserToGroups" >
    <div class="dialog__header">
        <span class="dialog__header-title">Mời tham gia nhóm</span>
        <div class="dialog__header-close" id="iconCloseDialogAddUserToGroups"><i class="fas fa-times"></i></div>
    </div>

    <div class="col-sm-12" style="background-color:#ccc;"></div>
    <div class="dialog__group">
        <span class="dialog-title">Thêm vào nhóm</span>
        <input type="text" id="filterAddUserToGroups" class="dialog__group-input" placeholder="Nhập tên muốn tìm">        
    </div>

    <div class="dialog__choose">
        <span class="dialog-title" id="titleSelectedAddUserToGroups">Đã chọn</span>

        <div class="dialog__choose-checked" id="selectedAddUserToGroups"></div>
        <span class="dialog-title">Nhóm</span>
        <div class="dialog__choose-list" id="groupAddUserToGroups"></div>
    </div>
    <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__footer">
            <div class="dialog__footer-container">
                <button class="dialog__footer-btn cancel" id="btnCloseAddUserToGroups">Hủy</button>
                <button class="dialog__footer-btn create" id="btnAddUserToGroups">Tạo nhóm</button>
            </div>
        </div>
    </div> 
    <div class="overlay"></div>
    `
}

function htmlDialogAddUsersToGroup(){
    return `
    <div class="dialog" id="dialogAddUsersToGroup" >
        <div class="dialog__header">
            <span class="dialog__header-title">Mời tham gia nhóm</span>
            <div class="dialog__header-close" id="headerIconCloseAddUsersToGroup"><i class="fas fa-times"></i></div>
        </div>

        <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__group">
            <span class="dialog-title" id="count-group-selected">Thêm vào nhóm</span>
            <input type="text" id="filterAddUsersToGroup" class="dialog__group-input" placeholder="Nhập tên muốn tìm">        
        </div>

        <div class="dialog__choose">
            <span class="dialog-title">Đã chọn</span>

        <div class="dialog__choose-checked" id="selectedAddUsersToGroup">
        </div>
        
        <span class="dialog-title" id="titleSelectedAddUsersToGroup">Danh sách</span>
        <div class="dialog__choose-list" id="userAddUsersToGroup">
        </div>
        </div>
       
        <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__footer">
            <div class="dialog__footer-container">
                <button class="dialog__footer-btn cancel" id="btnCloseAddUsersToGroup">Hủy</button>
                <button class="dialog__footer-btn create" id="btnAddUsersToGroup">Thêm</button>
            </div>
        </div>
    </div>
    <div class="overlay"></div>
    `
}

function htmlDialogCreatePersonalChats(){
    return `
    <div class="dialog" id="dialogCreatePersonalChats" >
        <div class="dialog__header">
            <span class="dialog__header-title">Chọn người để chat</span>
        </div>

        <div class="col-sm-12" style="background-color:#ccc;"></div>
        
        <div class="dialog__group">
            <span class="dialog-title">Chọn thêm người bạn muốn trò chuyện</span>
            <input type="text" id="filterCreatePersonalChats" class="dialog__group-input" placeholder="Nhập tên muốn tìm">        
        </div>

        <div class="dialog__choose">
        <span class="dialog-title" id="titleSelectedCreatePersonalChats">Đã chọn</span>
        <div class="dialog__choose-checked" id="selectedCreatePersonalChat">
            
            </div>
            
            <span class="dialog-title">Trò chuyện gần đây</span>
            <div class="dialog__choose-list" id="userCreatePersonalChat">
            
            </div>
        </div>
    <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__footer">
            <div class="dialog__footer-container">
                <button class="dialog__footer-btn create" id="btnCreatePersonalChat">Thêm</button>
            </div>
        </div>
    </div>
    <div class="overlay"></div>

    `
}

function htmlDialogListUser(){
    return `
    <div class="dialog" id="dialogListUser" >
        <div class="dialog__header">
            <span class="dialog__header-title">Thành viên</span>
            <div class="dialog__header-close" id="headerIconCloseListUser"><i class="fas fa-times"></i></div>
        </div>

        <div class="col-sm-12" style="background-color:#ccc;"></div>
        <div class="dialog__name">
            <span class="dialog-title">Tên người dùng</span>
            <input type="text" id="inputFilterListUser" class="dialog__name-input" placeholder="Nhập tên nhóm">        
        </div>

        <div class="dialog__user">
            <span class="dialog-title" id="count-user-in-group">Danh sách thành viên</span>
            <div class="dialog__user-container" id="list-user"></div>
        </div>
    </div>
    <div class="overlay"></div>
    `
}

//============================================================================================================
//---------------------------------------Function render html-------------------------------------------------
//============================================================================================================
   
//render ra cả user và group bên trái
async function renderCheckedUser(){
    //lấy user và group đã được check
    var checkedUsers = await getCheckedUser();
    var checkedGroups = await getCheckedGroup();
    var result = checkedUsers.concat(checkedGroups);
    //concat và sort theo updatedAt lại
    result = sortByUpdatedAt(result)
    // console.log(result)
    console.log("checkedUser", checkedUsers)
    //render ra html 
    var html = result.map((user)=>{ //{sender, receiver, updatedAt, id}
        if (user.isPersonal){//kiểm tra nếu personal thì reder theo personal
            return htmlCheckedUser(user.username, user.nickname, user.id, user.avatar, false)
        }else{//còn group thì render theo group
            return htmlCheckedGroup(user.name, user.id, user.avatar, false)
        }
    })
    //sau đó thì inner vào thẻ ul
    $('#list-chat-user').html(html)      
    return;
}


//render ra user bên phải
async function renderTotalUser(){
    // [{nickname, username, socketid}, ....]
    var totalUsers = await getTotalUser();
    var currentUser = await getCurrentUser();
    console.log("currentUser", currentUser)
    totalUsers = totalUsers.filter((user)=>{
        return user.username != currentUser.username
    })

    var html = totalUsers.map((user) => {
        return htmlTotalUser(user.username, user.nickname, user.avatar)
    })
    $('#list-total-user').html(html)
}

//render tat ca cac group cot ben phai
async function renderTotalGroup(){
    var groups = await getTotalGroup();
    var html = groups.map(group=>{
        return htmlToTalGroup(group.name, group.id, group.avatar); 
    })
    // console.log("renderTotalGroup", html)
    $('#list-total-user').html(html)
}

function compareDate(date1, date2){
    date1 = formatDate(date1)
    date2 = formatDate(date2)

    if (date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()){
        return true;
    }
    return false;
}

//render ra tinh nhắn
async function renderMessage(idRoom, type){
    console.log("render message")
    var messages = await getMessage(idRoom, page);
    var promises = messages.reverse().map(async (message, index)=>{
        if (message.isTimeLine){
            return htmlTimeLine(message.updatedAt) + await htmlMessage(message.sender, message.message, message.updatedAt, message.isShowTime);
        }else{
            return htmlMessage(message.sender, message.message, message.updatedAt, message.isShowTime)
        }
    })
    var html = await Promise.all(promises)
    if (type == 'inner'){
        $('#list-message').html(html)
    }else{
        $('#list-message').prepend(html);
    }

    if (messages.length < 10 && messages.length > 0){
        isIncreasePage = false;
    }
    scrollChatList()
}

function filterUserByInputCreateGroup(){
    $('#filterCreateGroup').on('input', function(){
        var option = $('#filter-user-create-group')
            .find('.dialog__option-container.active')
            .data('option')
        renderUserByOptionCreateGroup(option)
    })
}
function getUserCheckedCreateGroup(){
    var listUserChecked = $('#selectedCreateGroup')
        .find('.dialog__choose-checked-item[data-name != ' + $('#username').data('name') + ']')
        .map(function(){
            return $(this).data('name');
        }).toArray()
    return listUserChecked
}


//render list ở dưới của dialog create group
async function renderUserByOptionCreateGroup(option){
    var users = ""
    var html = ""
    var isChecked;
    //lay date theo option
    var users = await getUserByOptionCreateGroup(option)
    var listUserChecked = await getUserCheckedCreateGroup()
    var text = $('#filterCreateGroup').val();

    if (text){
        users = users.filter(function(user){
            return user.nickname.includes(text);
        })
    }

    console.log(listUserChecked)
    var promises = users.map((user)=>{
        //kiem tra user da check chua
        if ($.inArray(user.username, listUserChecked) != -1){
            isChecked = true;
        }else{
            isChecked = false;
        }
        
        return htmlUserDialog(user.username, user.nickname, user.avatar, isChecked)
    })
    html = await Promise.all(promises)
    $('#userCreateGroup').html(html)
    return;
}


//render ra số lượng người đã đc check trong phần dialog
function renderNumberSelectedCreateGroup(){
    renderNumberSelectedUser('#selectedCreateGroup', '#titleSelectedCreateGroup')
}

//render ra người dùng đã được chọn ở trên trong phần dialog
async function renderUserChecked(array){
    // console.log(array)
    var promises = array.map((item)=>{
        return htmlCheckedUserDialog(item.name, item.nickname, item.avatar)
    })
    html = await Promise.all(promises);
    $('#selectedCreateGroup').html(html);//inner html ra 
    renderNumberSelectedCreateGroup()//thay đổi số lượng nên là phải render lại số lượng người đã chọn
    return;
}

//render cái title ở trên cái tinh nhắn
async function renderThreadChat({id, nickname, name, isPersonal, avatar}){
    var html
    if (!isPersonal && !id && !nickname){
        isPersonal = true;
        nickname = '';
    }
    if (!isPersonal){
        var length = await getLengthGroupByIdRoom(id);
        html = htmlThreadChatGroup(name, length, avatar);
    }else{
        html = htmlThreadChatPersonal(nickname, avatar);
    }
    $('#thread-chat').html(html);
}  

//khi click và tùy vào option mà render 
//ở bên phải trang home
function renderTotalUserByOption(option){
    // console.log('renderTotalUserByOption', option)
    if (option == 'personal'){
        renderTotalUser();
    }else if (option == 'group'){
        renderTotalGroup();
    }
} 
//đếm xem có bao nhiêu group đã đc chọn
//rồi render ra text
function renderNumberSelectedAddUserToGroups(){
    renderNumberSelectedUser('#selectedAddUserToGroups', '#titleSelectedAddUserToGroups')
}

async function renderUserDialog(container, isFilter, input){
    var users = await getTotalUser();
    var idRoom = getCurrentIdRoom();
    var checkedUsers = $('#selectedCreatePersonalChat')
        .find('.dialog__choose-checked-item')
        .map(function(){
            return $(this).data('name')
        })
        .toArray()
    
    var text = $(input).val();
    if (text){
        users = users.filter(function(user){
            return user.username.includes(text);
        })
    }

    var promises = users.map(async (user)=>{
        var isDisable = false;
        var isChecked = false
        if (isFilter){
            var userInRoom = await getUserInRoom(idRoom);
            userInRoom = userInRoom.map(function(user){
                return user.username
            })

            isDisable = userInRoom.includes(user.username);
        }
        isChecked = checkedUsers.includes(user.username);

        return htmlUserDialog(user.username, user.nickname, user.avatar, isChecked, isDisable); 
    })
    var html = await Promise.all(promises);
    $(container).html(html);
}


function renderNumberCheckedUserCreatePersonalChats(){
   renderNumberSelectedUser('#selectedCreatePersonalChat', '#titleSelectedCreatePersonalChats')
}

async function renderMessageCantFind(){
    var html = htmlMessageCantFind();
    
    $('#list-message').html(html)
}

async function renderContainerChat(){
    var idRoom = getCurrentIdRoom();
    var infoRoom = await getUserInGroup(idRoom);
    page = 1;
    isIncreasePage = true;
    if (infoRoom){
        renderMessage(idRoom, 'inner');
    }else{
        htmlMessageCantFind();
    }
    renderThreadChat(infoRoom);
}


async function renderUserInRoom(isHost){
    var idRoom = getCurrentIdRoom();
    var users = await getUserInRoom(idRoom);

    var text = $('#inputFilterListUser').val()
    if (text){
        users = users.filter(function(user){
            return user.nickname.includes(text);
        })
    }

    var promises = users.map(async (user)=>{
        return await htmlUserInRoom(user.username, user.nickname, user.avatar, isHost);
    })
    var html = await Promise.all(promises);
    
    $('#list-user').html(html);
}

function renderTimeLine(date){
    var html = htmlTimeLine(date);
    console.log(html)
    $('#list-message').prepend(html);
}
// function renderInputChangeName(){
//     var html = htmlInputChangeName();
//     console.log(html)
//     $('#thread-chat').html(html);
// }
//============================================================================================================
//---------------------------------------Function get data from api-------------------------------------------------
//============================================================================================================

//lay thong tin user hien tai
async function getCurrentUser(){
    return await axios.get('/api/current-user')
    .then((response)=>{
        return response.data[0]
    })
}

//lay thong tin tat ca user
async function getTotalUser(){
    return await axios.get('/api/total-user')
    .then((response)=>{
        return response.data
    })
}

//lay tat ca group cua currentUser
async function getTotalGroup(){
    return await axios.get('/api/total-group')
    .then((response)=>{
        return response.data;
    })
}

//lay thong tin nhung user nam trong chat ist
async function getCheckedUser(){
    return await axios.get('/api/checked-user')
    .then((response)=>{
        return response.data
    })
}

//lay ra cac message cua 2 user or group chat
async function getMessage(idRoom, page){
    return await axios.get(`/api/messages/${idRoom}`)
    .then((response)=>{
        //lấy mổi lần 10 item
        var lengthPerPage = 10;
        var begin = (page - 1) * lengthPerPage;
        var end = (page - 1) * lengthPerPage + lengthPerPage;
        return response.data.slice(begin, end)
    })
}

//lay thong tinh nhung cai group ma currentUser dang o
async function getCheckedGroup(){
    return await axios.get('/api/checked-group')
    .then((response)=>{
        return response.data
    })
}

//lay tat ca group cua 1 user bat ky
async function getTotalGroupByUsername(receiver){
    return await axios.get(`/api/total-group/${receiver}`)
    .then((response)=>{
        return response.data
    })
}

//lay tat ca group cua 1 user bat ky
async function getLengthGroupByIdRoom(idRoom){
    return await axios.get(`/api/length-group/${idRoom}`)
    .then((response)=>{
        return response.data
    })
}

//get info group
async function getUserInGroup(idRoom){
    return await axios.get(`/api/group/${idRoom}`)
    .then((response)=>{
        return response.data
    })
}

async function getUserInRoom(idRoom){
    return await axios.get(`/api/user-in-group/${idRoom}`)
        .then((response)=>{
            return response.data;
        })
}


async function getUserHostInRoom(idRoom){
    return await axios.get(`/api/user-host-room/${idRoom}`)
        .then((response)=>{
            return response.data;
        })
}

async function getUserByUsername(username){
    return await axios.get(`/api/user-by-username/${username}`)
        .then((response)=>{
            return response.data;
        })
}

async function getIdRoomOnline(){
    return await axios.get(`/api/idroom-online`)
        .then((response)=>{
            return response.data;
        })
}

async function getIsHost(username, idRoom){
    return await axios.get(`/api/is-host/${username}/${idRoom}`)
        .then((response)=>{
            return response.data;
        })
}

async function getMessageOldest(idRoom){
    return await axios.get(`/api/message-oldest/${idRoom}`)
        .then((response)=>{
            return response.data;
        })
}
async function getMessageNearest(idRoom){
    return await axios.get(`/api/message-nearest/${idRoom}`)
        .then((response)=>{
            return response.data;
        })
}
//============================================================================================================
//---------------------------------------Function show hide dialog -------------------------------------------------
//============================================================================================================
//********************LIST MESSAGE***********************/
function showListMessage(){
    $('#list-message').removeAttr("hidden")
}
function hideListMessage(){
    $('#list-message').attr('hidden');
}

//********************CREATE GROUP***********************/
function showDialogCreateGroup(){
    // console.log("show create group")
    var html = htmlDialogCreateGroup();
    $('.container').prepend(html);
}
function hideDialogCreateGroup(){
    $('#dialogCreateGroup').remove()
    $('.overlay').remove()
}

//********************ADD GROUP***********************/
function showDialogAddUserToGroups(){
    var html = htmlDialogAddUserToGroups();
    $('.container').prepend(html);
}
function hideDialogAddUserToGroups(){
    $('#dialogAddUserToGroups').remove()
    $('.overlay').remove()
}

//********************ADD USER***********************/
function showDialogCreatePersonalChats(){
    var html = htmlDialogCreatePersonalChats();
    $('.container').prepend(html);
}
function hideDialogCreatePersonalChats(){
    // console.log($('#dialogAddUser'))
    $('#dialogCreatePersonalChat').remove()
    $('.overlay').remove()
}

//********************LIST USER***********************/
function showDialogListUser(){
    var html = htmlDialogListUser();
    $('.container').prepend(html);
}
function hideDialogListUser(){
    $('#dialogListUser').remove();
    $('.overlay').remove();
}

//********************ADD USERS TO GROUP***********************/
function showDialogAddUsersToGroup(){
    var html = htmlDialogAddUsersToGroup();
    $('.container').prepend(html);
}
function hideDialogAddUsersToGroup(){
    $('#dialogAddUsersToGroup').remove();
    $('.overlay').remove();
}

function hideAllDialog(){
    $('#dialogAddUserToGroups').remove()
    $('#dialogListUser').remove()
    $('#dialogAddUsersToGroup').remove()
    $('#dialogCreateGroup').remove()
    $('#dialogCreatePersonalChat').remove()
    $('.overlay').remove()
}
//============================================================================================================
//------------------------------------------------Hàm dùng lại nhiều lần--------------------------------------
//============================================================================================================
//thay đổi style màu bg cho thằng vừa tương tác 
function activeCurrentReceiver(){
    var currentIdRoom = getCurrentIdRoom() || $('#btn-send-message').data('idroom')
    $('.list-chat-user-item.active').removeClass('active')//xóa hết mấy thằng có class active
    window.history.pushState("", "", `/chat/${currentIdRoom}`)
    renderContainerChat()
    //cái thằng có data-id bằng với cái idRoom hiện tại 
    var $itemActive =  $(`.list-chat-user-item[data-id=${currentIdRoom}]`)
    $itemActive.addClass('active')
}
function sortByUpdatedAt(array){
    array = array.sort((a, b)=>{ 
        var aValue = new Date(a.updatedAt).getTime()
        var bValue = new Date(b.updatedAt).getTime()

        return bValue - aValue 
    })
    return array;
}

//đóng dialog 
function handleCloseDialog(array, callback, condition){

    array.forEach((item)=>{
        $(document).on('click', item, function(){
            if (condition){
                if (condition() == false) return;
            }
            swal({
                title: "Xác nhận",
                text: "Bạn có chắc muốn bỏ tạo nhóm này?",
                buttons: true,
            })
            .then((willDelete) => {//nếu click ok thì ẩn dialog đi
                if (willDelete){
                    callback()
                }
            });
        })
    })
}

//khi nhấn vào dấu x trong user checked trong dialog
function handleRemoveAndCheck(element, type){
    var nameData = "data-" + type;
    var containerTag = $(element).closest(".dialog__choose-checked-item");
    var idRoom = containerTag.attr(nameData);
    containerTag.closest('.dialog__choose')
                .find(".dialog__choose-list input[" + nameData + "='" + idRoom + "']")
                .prop('checked', false);
    containerTag.remove();
    return;
}

async function handleClickCheckbox(container, type, success, final){
    $(document).on('change', `${container} .dialog__choose-item-input`, async function(){
        var primary = $(this).data(type);
        var foreign = $(this).siblings('label').text();
        if ($(this).is(':checked')){
            var avatar = $(this).siblings('img').attr('src')
            console.log("avatar", avatar)
            await success(primary, foreign, avatar)
        }else{
            $(".dialog__choose-checked-item[data-" + type + "= " + primary + "]").remove()
        }
        if (final){
            final();
            console.log("type", typeof(final));
        }
        return;
    })
}

function renderNumberSelectedUser(container, ele){
    var length = $(container).find('.dialog__choose-checked-item').length;
    console.log('length', container, length);
    $(ele).html(`Đã chọn (${length})`)
}


//tùy vào option và dialog nào mà mình render khác nhau
function filterByOption(container, renderCallBack){
    $(container).on('click', 'div.dialog__option-container', function(){
        var option = $(this).data('option');
        $(container)
                .find('.dialog__option-container.active')
                .removeClass('active');

        $(this).addClass('active');
        renderCallBack(option)
    })
}

async function getCheckedListByOption(option){
    switch(option){
        case 'personal':{
            var checkedUsers = await getCheckedUser();
            return sortByUpdatedAt(checkedUsers)
        }
        case 'group':{
            var checkedGroups = await getCheckedGroup();
            return sortByUpdatedAt(checkedGroups)
        }
        case 'all':{
            var checkedUsers = await getCheckedUser();
            var checkedGroups = await getCheckedGroup();
            var result = checkedUsers.concat(checkedGroups)
            return sortByUpdatedAt(result)
        }
    }
}

async function renderCheckedListByOption(option){
    var result = await getCheckedListByOption(option);
    var roomOnline = await getIdRoomOnline();
    var html = result.map((user)=>{ //{sender, receiver, updatedAt, id}
        var isOnline = $.inArray(Number.parseInt(user.id), roomOnline) != -1;

        if (user.isPersonal){//kiểm tra nếu personal thì reder theo personal
            return htmlCheckedUser(user.username, user.name, user.id, user.avatar, isOnline)
        }else{//còn group thì render theo group
            return htmlCheckedGroup(user.name, user.id, user.avatar, isOnline)
        }
    })
    $('#list-chat-user').html(html)      
    activeCurrentReceiver()
}

function checkBtnSubmit(container, lengthRequire){
    var length = $(container).find('.dialog__choose-checked-item').length
    var btnSubmit = $(container).find('.dialog__footer-btn.create')
    if (length >= lengthRequire){
        btnSubmit.removeAttr('disabled', 'disabled')
            .css('cursor', 'default');
    }else{
        btnSubmit.attr('disabled', 'disabled')
            .css('cursor', 'not-allowed');
    }
}


function appendChatListRoll(){
    var scrollTop;
    var heightContainer = $('#list-message').height();
    $('#list-message').on('scroll', async function(){

        scrollTop = $('#list-message').scrollTop()
        console.log(scrollTop)

        if (scrollTop === 0){//nếu scroll đến đỉnh thì append thêm
            var idRoom = getCurrentIdRoom();

            if (isIncreasePage){
                page++;
                await renderMessage(idRoom, 'prepend');
            }
            console.log(-heightContainer)
            $('#list-message').scrollTop(10)
            console.log("page", page)
        }
    })
}

function alertHasButton(text){
    return swal({
        title: text,
        buttons: true,
        dangerMode: true,
      })
    .then((willDelete) => {
        return willDelete
    });
}

function scrollChatList(){
    var listMessageElement = document.querySelector('#list-message')
    listMessageElement.scrollTop = 9999999
}

function getCurrentIdRoom(){
    var urlString = window.location.pathname;
    return urlString.split('/')[2]
}
function formatMinute(minutes){
    if (minutes < 10){
        minutes = "0" + minutes
    }
    return minutes
}

//============================================================================================================
//---------------------------------------Hàm hổ trợ dialog Create Group---------------------------------------
//============================================================================================================

//lấy data của user tùy vào options
async function getUserByOptionCreateGroup(option){
    var data;
    switch (option){
        case "all":{
            data = await getTotalUser()
            break;
        }
        case "in_list":{
            data = await getCheckedUser()
            break;
        }
        case "checked":{
            data = $('.dialog__choose-item-input:checked').map(function(){//lay ra nhung thang da chon
                return {
                    username: $(this).data('name'),
                    nickname: $(this).siblings('label').text(),
                    avatar: $(this).siblings('img.avatar').attr('src')
                }
            })
            data = data.toArray()
            break;
        }
    }
    return data;
}
//render trong dialog create group
function filterUserCreateGroup(){
    filterByOption('#filter-user-create-group', renderUserByOptionCreateGroup)
}

function checkBtnSubmitCreateGroup(){
    checkBtnSubmit('#dialogCreateGroup', 3);
}

//đóng dialog create group
function handleCloseDialogCreateGroup(){
    var array = ['#headerIconCloseCreateGroup', '#btnCloseCreateGroup']
    handleCloseDialog(array, hideDialogCreateGroup)
}

//click check box create group 
function handleClickCheckboxCreateGroup(){
    handleClickCheckbox('#userCreateGroup', 'name', async function(primary, foreign, avatar){
        var html = await htmlCheckedUserDialog(primary, foreign, avatar)
        
        $('#selectedCreateGroup').append(html)    
    }, function(){
        checkBtnSubmitCreateGroup()
        renderNumberSelectedCreateGroup() 
    })
}



//khi nhấn vào dấu x trong user checked trong dialog cre gr
function handleClickRemoveCreateGroup(){
    $(document).on('click', '#selectedCreateGroup div.container-close', function(){
        handleRemoveAndCheck(this, 'name');

        checkBtnSubmitCreateGroup()
        renderNumberSelectedCreateGroup()
    })
}

function submitDialogCreateGroup(){
    //cái này là khi mà tạo bằng from 
    //khi click vào tạo
    $('#btn-create-group-chat').click(async function(){
        console.log("CKICIHAJDHAKDH")
        if (!validator.submit('#dialogCreateGroup')) return;

        var listNameUserChecked = [];
        var inputAvatar = $('#avatar')
        var formData = new FormData();
        console.log(inputAvatar.prop('files')[0])
        

        $('.dialog__choose-checked-item').off().each(function(index, userCheckedItem){
            listNameUserChecked.push($(userCheckedItem).data('name'));
        })

        formData.append("avatar", inputAvatar.prop('files')[0]);
        formData.append('usernames', listNameUserChecked);
        formData.append('name', $('#name-group').val())
        $.ajax({
            url: '/create-group-chat',
            data: formData,
            method: 'POST',
            contentType: false,
            processData: false,
            success: function(){
                ///xong thì đóng cái dialog lại
                hideDialogCreateGroup()
            }
        })
    })
}

async function getFirstUserCheckedCreateGroup(ele){
    var container = $(ele).closest('.list-chat-user-item')
    var containerAvatar = container.find('img.avatar').attr('src')
    var currentUser = await getCurrentUser();

    $('#userCreateGroup')
        .find('.dialog__choose-item-input[data-name=' + container.data('name') + ']')
        .prop('checked', true)

    //hiện dialog create group và cho thêm cái overlay bên ngoại hiện lên
    //Sau đó sẽ có 2 thằng đầu tiên được auto chọn là
    //thằng currentUser và thằng được click theo thứ tự ở dưới
    var userChecked = [
        {
            nickname: currentUser.nickname,
            name: currentUser.username,
            avatar: currentUser.avatar
        }, 
        {
            nickname: container.data('nickname'),
            name: container.data('name'),
            avatar: containerAvatar
        }
    ]
    return userChecked
}

//============================================================================================================
//---------------------------------------Hàm hổ trợ dialog Add User To Groups---------------------------------------
//============================================================================================================

function filterGroupByInputAddUserToGroups(receiver){
    $('#filterAddUserToGroups').on('input', function(){
        renderGroupAddUserToGroups(receiver)
    })
}

function checkBtnSubmitAddUserToGroups(){
    checkBtnSubmit('#dialogAddUserToGroups', 1);
}
function closeDialogAddUserToGroups(){
    var array = ['#btnCloseAddUserToGroups', '#iconCloseDialogAddUserToGroups']
    handleCloseDialog(array, hideDialogAddUserToGroups)
}
    
function handleChangeCheckboxAddUserToGroups(){
    handleClickCheckbox('#groupAddUserToGroups', 'idroom', async function(primary, foreign, avatar){
        var html = htmlGroupCheckedAddUserToGroups(primary, foreign, avatar);
        $('#selectedAddUserToGroups').append(html);
    }, function(){
        renderNumberSelectedAddUserToGroups()
        checkBtnSubmitAddUserToGroups()
    })
}
//khi nhấn vào dấu x trong user checked trong dialog add gr
function handleClickRemoveAddUserToGroups(){
    $(document).on('click', '#selectedAddUserToGroups .remove-group', function(){
        console.log("Click")
        handleRemoveAndCheck(this, 'idroom');
        renderNumberSelectedAddUserToGroups();
        checkBtnSubmitAddUserToGroups();
    })
}

function submitDialogAddUserToGroups(userAdd){
    $('#btnAddUserToGroups').on('click', function(){
        var idRooms = $('.group-selected').map(function(){
            return $(this).data('idroom');
        }).toArray();

        //sau đó gọi ajax xuống backed sử lý
        $.ajax({
            url: '/add-user-to-groups', 
            method: 'POST',
            data: {
                username: userAdd,
                idRooms: idRooms
            },
            success: function(){
                //sau khi xong thì đóng dialog
                hideDialogAddUserToGroups()
            }
        })
    })
}

//render các checkbox group trong dialog add group ở dưới
async function renderGroupAddUserToGroups(receiver){
    var groupCurrentUser = await getCheckedGroup();
    var groupReceiver = await getTotalGroupByUsername(receiver);
    var isDisable

    var text = $('#filterAddUserToGroups').val()
    if (text){
        groupCurrentUser = groupCurrentUser.filter(function(group){
            return group.name.includes(text);
        })
    }

    var html = groupCurrentUser.map((currentGr)=>{
        //disabled checkbox cua group mà thằng cbi đc add đã có trong group đó r
        isDisable = groupReceiver.some((receiverGr)=>{
            return currentGr.id === receiverGr.id
        })
        return htmlGroupAddUserToGroups(currentGr.name, currentGr.id, currentGr.avatar, isDisable)
    })

    $('#groupAddUserToGroups').html(html)
    return;
}
//============================================================================================================
//---------------------------------------Dialog Create Personal Chats---------------------------------------
//============================================================================================================

// function closeDialogCreatePersonalChats(){
//     var array = ['#btnCloseAddUser', '#headerIconCloseAddUser']
//     handleCloseDialog(array, hideDialogAddUser)
// }

//khi mà click vào checkbox trong dialog add group
function filterUserByInputCreatePersonalChats(container, isFilter){
    $('#filterCreatePersonalChats').on('input', function(){
        renderUserDialog(container, isFilter, '#filterCreatePersonalChats')
    })
}
function handleChangeCheckboxCreatePersonalChats(){
    handleClickCheckbox('#userCreatePersonalChat', 'name', async function(primary, foreign, avatar){
        var html = await htmlCheckedUserDialog(primary, foreign, avatar);
        $('#selectedCreatePersonalChat').append(html);
        return;
    }, function(){
        renderNumberCheckedUserCreatePersonalChats();
        checkBtnSubmitCreatePersonalChats();
    })
}

function handleClickRemoveCreatePersonalChats(){
    $('#selectedCreatePersonalChat').on('click', 'div.container-close', function(){
        handleRemoveAndCheck(this, 'name');
        checkBtnSubmitCreatePersonalChats();
        renderNumberCheckedUserCreatePersonalChats();
    })
}
function submitDialogCreatePersonalChats(){
    $('#btnCreatePersonalChat').on('click', function(){
        var receivers = $('#selectedCreatePersonalChat')
            .find('.dialog__choose-checked-item')
            .map((idx, container)=>{
                console.log($(container).data('name'))
                return $(container).data('name')
            })
            .toArray();
        console.log(receivers);

        $.ajax({
            url: '/create-or-add-chat-list-personal',
            data: {
                receivers: receivers
            },
            method: 'POST',
            success: function(){
                hideDialogCreatePersonalChats();
            } 
        })
    })
}
function checkBtnSubmitCreatePersonalChats(){
    checkBtnSubmit('#dialogCreatePersonalChat', 1);
}
// ==================================Dialog Add Users To Group===============================
// ==================================Dialog Add Users To Group===============================
// ==================================Dialog Add Users To Group===============================

function filterUserByInputAddUsersToGroup(container, isFilter){
    $('#filterAddUsersToGroup').on('input', function(){
        renderUserDialog(container, isFilter, '#filterAddUsersToGroup')
    })
}

function renderNumberSelectedAddUsersToGroup(){
    renderNumberSelectedUser('#selectedAddUsersToGroup', '#titleSelectedAddUsersToGroup')
}

function submitDialogAddUsersToGroup(){
    $('#btnAddUsersToGroup').on('click', function(){
        var users = $('#selectedAddUsersToGroup')
            .find('.dialog__choose-checked-item')
            .map(function(){
                return $(this).data('name')
            })
            .toArray();
        const data = {
            usernames: users,
            idRoom: getCurrentIdRoom(),
        }

        $.ajax({
            url: '/add-user-to-groups',
            data: data,
            method: 'POST',
            success: function(){
                hideDialogAddUsersToGroup()
            }
        })

    })
    
}

async function handleClickCheckboxAddUsersToGroup(){
    handleClickCheckbox('#userAddUsersToGroup', 'name', async function(primary, foreign, avatar){
        var html = await htmlCheckedUserDialog(primary, foreign, avatar)
        $('#selectedAddUsersToGroup').append(html)
    }, function(){
        renderNumberSelectedAddUsersToGroup()
    })
}


function handleClickRemoveAddUsersToGroup(){
    $(document).on('click', '#selectedAddUsersToGroup div.container-close', function(){
        handleRemoveAndCheck(this, 'name');
        renderNumberSelectedAddUsersToGroup()
    })
}

function closeDialogAddUsersToGroup(){
    var array = ['#headerIconCloseAddUsersToGroup', '#btnCloseAddUsersToGroup']
    handleCloseDialog(array, hideDialogAddUsersToGroup)
}

// =================================Dialog List User============================================
// =================================Dialog List User============================================
// =================================Dialog List User============================================

function filterUserByInputListUser(isHost){
    $('#inputFilterListUser').on('input', function(){
        renderUserInRoom(isHost)
    })
}

async function addChatListInDialogListUser(){
    $('#list-user').on('click', '.inbox-dialog-list-user', function(){
        var idRoom = getCurrentIdRoom();
        var container = $(this).closest('.list-user-item');
        var receiver = container.data('name');
        
        var data = {idRoom, receiver}
        $.ajax({
            url: '/create-or-add-chat-list-personal',
            method: 'POST',
            data: data,
            success: function(){
                hideDialogListUser();
            }
        })
    })
}


async function kickUserDialogListUser(){
    $('#list-user').on('click', '.kick-dialog-list-user',async function(){
        var isDelete =  await alertHasButton('are you sure???');
        console.log(isDelete)
        if (!isDelete){
            return;
        }
        console.log('run here')
        var idRoom = getCurrentIdRoom();
        var container = $(this).closest('.list-user-item');
        var receiver = container.find('span.dialog-name').text();
        var data = {receiver: container.data('name'), idRoom};
        $.ajax({
            url: '/kick-out-group',
            method: 'POST',
            data: data,
            success: function(){
                container.remove();
                renderNumberUserDialogListUser();
            }
        })
    })
}
function htmlNumberUserDialogListUser(length){
    return `Danh sách thành viên (${length})`
}

async function renderNumberUserDialogListUser(){
    var idRoom = getCurrentIdRoom();
    var length = await getLengthGroupByIdRoom(idRoom)
    var html = htmlNumberUserDialogListUser(length)
    $('#count-user-in-group').html(html)
}




function closeDialogListUser(){
    var array = ['#headerIconCloseListUser']
    handleCloseDialog(array, hideDialogListUser);
}
function leaveGroupListUser(){
    $('#list-user').on('click', '.leave-group', async function(){
        var idRoom = getCurrentIdRoom();
        var currentUser = await getCurrentUser()
        var isHost = await getIsHost(currentUser.username, idRoom);
        if (isHost){
            alertHasButton('You are the admin, you need to remove the admin before leaving the group');
        }else{
            $.ajax({
                url: '/kick-out-group',
                method: 'POST',
                data:{
                    receiver: currentUser.username, 
                    idRoom: idRoom
                },
                success: function(){
                }
            })
        }
    })
}

function appointAdminListUser(){
    $('#list-user').on('click', '.appoint-admin', async function(){
        var isAppoint = await alertHasButton('are you sure??');
        if (isAppoint){
            var container = $(this).closest('.list-user-item');
            var data = {
                username: container.data('name'),
                idRoom: getCurrentIdRoom()
            }
            $.ajax({
                url: '/appoint-admin-group', 
                data: data,
                method: 'POST',
                success: function(){
                    hideDialogListUser();
                }
            })
        }
    })
}

//============================================================================================================
//---------------------------------------Hàm hổ trợ sử lý trang chat---------------------------------------
//============================================================================================================

//hàm làm đẹp sử lý khi hover vào item của list receiver thì đổi màu tí
//và đổi con chuột sang poiter và đổi màu thằng đang chọn cho nó khác biệt
function handleHoverListReceiver(){
    $('#list-chat-user').on('mouseover', '.list-chat-user-item', function(){
        $(this).removeClass('list-group-item-info')
            .addClass('list-group-item-primary')
            .css('cursor', 'pointer') //thay doi con chuot
    })
    
    $('#list-chat-user').on('mouseout', '.list-chat-user-item', function(){
        $(this).removeClass('list-group-item-primary')
            .addClass('list-group-item-info')
    })

    $('#list-chat-user').on('click', '.list-chat-user-item', function(){
        //them active cho chinh thang do khi click vo no
        $('.list-chat-user-item.active').removeClass('active')
        $(this).addClass('active')
        $('.container-send-message').show()
        // console.log("SHOW")
    })
}
function filterCheckedList(){
    filterByOption('#filter-checked-list', renderCheckedListByOption)
}


//hadle when hover and click to a user in chat list
async function handleClickReceiver(){
    $('#list-chat-user').on('click', 'li', function(){
        var idRoom = $(this).data('id')
        var name = $(this).data('nickname')
        var isPersonal = $(this).data('name') ? true : false

        //thay đổi url cho giống với thực tế để copy sẽ ra đúng trang đó
        window.history.pushState("", "", `/chat/${idRoom}`)
        //thay đổi attribuute data-idroom để mà sau này sẽ lấy cái data này 
        //gữi về cho server 
        renderContainerChat();
        // renderThreadChat(idRoom, name, isPersonal)
        showListMessage()
    })
}

//render cho total user theo option
function filterListTotalUser(){
    filterByOption('#filter-total-list', renderTotalUserByOption)
}

function closeDialogByOverlay(){
   
    handleCloseDialog(['.overlay'], hideAllDialog, function(){
        var isHideDialogCreateGroup = $('#dialogCreateGroup').length === 0;
        var isHideDialogAddUserToGroups = $('#dialogAddUserToGroups').length === 0;
        var isHideDialogAddUsersToGroup = $('#dialogAddUsersToGroup').length === 0;
        var isHideDialogListUser = $('#dialogListUser').length === 0;
        if (!isHideDialogCreateGroup || !isHideDialogAddUserToGroups || !isHideDialogAddUsersToGroup || !isHideDialogListUser){
            return true;
        }
        return false;
    })
}

function changeName(){
    $(document).on('click', '#edit-name', function(){
        $('#name-room').attr('hidden', 'hidden');
        $('#container-change-name').removeAttr('hidden')
    })
    submitChangeName()
}

function submitChangeName(){
    $(document).on('click', '#submit-change-name', function(){
        var text = $('#input-change-name').val();
        var idRoom = getCurrentIdRoom()
        var data = {
            text,
            idRoom,
        }
        console.log(data)

        $('#container-change-name').attr('hidden', 'hidden')
        $.ajax({
            url: '/change-name',
            data: data,
            method: 'POST',
            success: async function(){
                var infoRoom = await getUserInGroup(idRoom); 
                renderThreadChat(infoRoom)                    
            }
        })
    })
    
}


$(document).ready(()=>{
    
//==============================================================================================================
//---------------------------------------Function handle event -------------------------------------------------
//==============================================================================================================
    
    //functuon emit to server socket id of new user login
    function emitNewUserOnline(){
        getCurrentUser() //[{nickname, username, socketid}]
            .then((data)=>{
                //emit về server để add socketid
                // socket.id = data.socketid
                socket.username = data.username
                socket.emit('join socket id new user online', data)
            })
            .catch((err)=>{
                throw err
            })
    }
    
    //add a user to chat list
    function addChatListUser(){
        $('#list-total-user').on('click', 'button.add-chat-list',async function(){
            var container = $(this).closest('.list-group-item');
            var data = {//username của receiver và sender 
                receiver: container.data('name'),
            }
            //gọi ajax sau khi gọi ajax thì
            //server sẽ emit lên để mà render ra html
            //"sender add chat list" ở dưới cùng
            $.ajax({
                url: '/create-or-add-chat-list-personal',
                method: 'POST',
                data: data,
                success: function(){
                }
            })
        })
    }

    function addChatListGroup(){
        $('#list-total-user').on('click', 'button.add-chat-list-group', function(){
            var container = $(this).closest('.list-group-item')
            var idRoom = container.data('idroom')
            $.ajax({
                url: '/set-updatedAt-group-chat', 
                method: 'POST',
                data: JSON.stringify({
                    idRoom,
                    isShow: false
                }),
                contentType: 'application/json',
                dataType: 'json',
                success: function(){
                }
            })
        })
    }

  
    //remove a user chat list
    function hideChatList(){
        //lập qua những btn để ẩn chat list
        //khi click thì lấy gữi xuống server
        //data gồm useruser của sender và receiver 
        $('#list-chat-user').on('click', 'button.hide-chat-list', function(){
            var data = {
                idRoom: getCurrentIdRoom(),
            }
            //gọi ajax tới controller để sử lý 
            //sa khi sử lý xong thì server sẽ emit về
            //client "sender hide chat list"
            $.ajax({
                url: '/hide-chat-list',
                method: 'POST', 
                data: data,
                success: function(){
                }
            })
        })
    }

    //day la hàm chính để sử lý trong cái dialog
    function handleDialogCreateGroup(){
        
        handleClickCheckboxCreateGroup()
        handleClickRemoveCreateGroup()
        $('#list-chat-user').on('click', 'button.create-group-chat', async function(){
            showDialogCreateGroup()
            var container = $(this).closest('.list-chat-user-item')
            var userChecked = await getFirstUserCheckedCreateGroup(this)
            renderUserChecked(userChecked);

            await renderUserByOptionCreateGroup("in_list");
            filterUserByInputCreateGroup()
            console.log(userChecked)

            $(`.dialog__choose-item-input[data-name=${container.data('name')}]`)
                .prop('checked', true);
        

            checkBtnSubmitCreateGroup();

            //su ly khi chon option
            filterUserCreateGroup()
            submitDialogCreateGroup()
            handleCloseDialogCreateGroup();
        })
        
    }
    //hàm chính sử lý dialog add group
    async function handleDialogAddUserToGroups(){
        handleClickRemoveAddUserToGroups();
        handleChangeCheckboxAddUserToGroups()

        $('#list-chat-user').on ('click', 'button.add-group-chat', async function(){
            showDialogAddUserToGroups();
            var containerTag = $(this).closest('.list-chat-user-item')
            var userAdd = containerTag.data('name')
            $('#selectedAddUserToGroups').html('')

            await renderGroupAddUserToGroups(userAdd);
            renderNumberSelectedAddUserToGroups()

            filterGroupByInputAddUserToGroups(userAdd)

            checkBtnSubmitAddUserToGroups()
            
            submitDialogAddUserToGroups(userAdd);
            closeDialogAddUserToGroups();
        })
    }

    
   
    function handleDialogAddUsersToGroup(){
        handleClickRemoveAddUsersToGroup(); 
        handleClickCheckboxAddUsersToGroup();
        
        $('#list-chat-user').on('click', '.add-users-to-group', function(){
            console.log("hihi")
            showDialogAddUsersToGroup();
            var isFilter = true;
            renderUserDialog('#userAddUsersToGroup', isFilter);
            renderNumberSelectedAddUsersToGroup()
            filterUserByInputAddUsersToGroup('#userAddUsersToGroup', isFilter)
            closeDialogAddUsersToGroup();
            submitDialogAddUsersToGroup();
        })
    }

    async function handleDialogCreatePersonalChats(){
        showDialogCreatePersonalChats();
        var isFilter = false;
        renderUserDialog('#userCreatePersonalChat', isFilter);
        renderNumberCheckedUserCreatePersonalChats();
        checkBtnSubmitCreatePersonalChats();
        filterUserByInputCreatePersonalChats('#userCreatePersonalChat', isFilter);
        handleChangeCheckboxCreatePersonalChats();
        handleClickRemoveCreatePersonalChats();
        submitDialogCreatePersonalChats()
    }

    async function handleDialogListUser(){
        
        
        $(document).on('click', '#icon-setting', async function(){
            showDialogListUser();
            var idRoom = getCurrentIdRoom();
            var userHost = await getUserHostInRoom(idRoom);
            var currentUser = await getCurrentUser();
            var isHost = userHost.username === currentUser.username;

            renderNumberUserDialogListUser();
            renderUserInRoom(isHost);
            filterUserByInputListUser(isHost)
            closeDialogListUser();
            addChatListInDialogListUser();
            kickUserDialogListUser();
            appointAdminListUser();
            leaveGroupListUser();
        })
    }
    //functuon sử lý khi chat
    async function sendMessage(){
        $('#btn-send-message').on('click', async function(){
            var sender
            var text = $('#input-send-message').val()
            var idRoom = getCurrentIdRoom()
            var currentUser = await getCurrentUser();
            //lấy ra username của người nhận message
            //lấy thằng có class đó và có data-id == idRoom hiện tại rồi lấy ra name của nó
            sender = $(`.list-chat-user-item[data-id=${idRoom}]`).data('name')
        
            // console.log(sender)
            if (text){
                //emit tới server data của message
                var dataMessage = {
                    sender: currentUser.username,
                    idRoom: idRoom,
                    message: text
                }
                $('#input-send-message').val('')
                console.log("data message", dataMessage)
                socket.emit('sender send message', dataMessage)

                //nếu là personal
                if (sender){
                    var data = {
                        receiver: sender,
                        sender: currentUser.username,
                        
                    }
                    $.ajax({
                        url: '/create-or-add-chat-list-personal',
                        method: 'POST',
                        data: data,
                        success: function(){
                        }
                    })
                    //cái này là group
                }else if (!sender){
                    var data = {
                        idRoom: idRoom,
                        isShow: true,
                    }
                    $.ajax({
                        url: '/set-updatedAt-group-chat', 
                        method: 'POST',
                        data: JSON.stringify(data),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(){
                        }
                    })
                }
            }
        })
    }    
    //hàm chính để sử lý
    async function main(){
        scrollChatList() //scroll thanh chat xuong
        await renderCheckedUser() //block ben trai
        renderTotalUser() //block ben phai
        emitNewUserOnline()

        activeCurrentReceiver() //doi mau nguoi dang chat
        closeDialogByOverlay();
        var currentIdRoom = await getCurrentIdRoom();
        console.log('currentIdRoom', Number.parseInt(currentIdRoom), !Number.parseInt(currentIdRoom))
        if (Number.parseInt(currentIdRoom) <= 0){
            handleDialogCreatePersonalChats();
        }

        sendMessage() //sy ly khi gui tinh nhan
        hideChatList() //su ly khi nhan vao Ẩn
        addChatListGroup()
        handleDialogCreateGroup() //su ly khi nhan vao
        handleDialogAddUserToGroups()
        handleDialogListUser()
        handleDialogAddUsersToGroup()

        handleClickReceiver() //
        handleHoverListReceiver()
        addChatListUser() //su ly khi nhan vao them
        filterListTotalUser()
        filterCheckedList()
        changeName()
        showListMessage()
        appendChatListRoll()
    }
    main()
    
    
//--------------------------------------On event from server-------------------------------------------------

    socket.on('changed', (data)=>{ // undefined
    })
    //nhận event new user rồi innerHTML vào thẻ UL
    socket.on('new user', (data)=>{ //{username, nickname}
        var html = htmlItemTotalList(data.username, data.nickname)
        $('#list-total-user').append(html)
    })

    socket.on('user online', (userOnline)=>{
        console.log(userOnline)
    })

    socket.on('add chat list', async function(data){
        var container = $(`.list-chat-user-item[data-id=${data.idRoom}]`);  
        var firstChild = $('#list-chat-user .list-chat-user-item:first-child');
        
        if (container.length > 0){
            firstChild.before(container);
        }else{
            var roomOnline = await getIdRoomOnline();
            var isOnline = $.inArray(Number.parseInt(data.idRoom), roomOnline) != -1;
            var html;
            if (data.isPersonal){
                html = htmlCheckedUser(data.receiver, data.nickname, data.idRoom, data.avatar, isOnline)
            }else{
                html = htmlCheckedGroup(data.groupName, data.idRoom, data.avatar, isOnline);
            }
            $('#list-chat-user').prepend(html)
            if (data.isActive){
                window.history.pushState("", "", `/chat/${data.idRoom}`)
                showListMessage()
                activeCurrentReceiver()
                $('.container-send-message').show()
                // $('.list-chat-user-item.active').removeClass('active')
            }
        }
        
    })

    //lắng nghe event ẩn 1 user cột bên trái
    socket.on('hide chat list', ({idRoom})=>{
        $(`.list-chat-user-item[data-id=${idRoom}]`).remove();
        $('.container-send-message').hide()
        $('#list-message').html("");
        hideListMessage()
    })

    //khi mà sender send message thì sẽ hiện lên trên màng hình của sender
    socket.on('server send message', async ({message, sender, idRoom})=>{
        console.log({message, sender, idRoom})
        if (getCurrentIdRoom() === idRoom){
            var date = new Date();
            var isTimeLine = 1;//1 is true in sql
            var isShowTime = true;
            var html = '';
            var messageNearest = await getMessageNearest(idRoom);
            console.log("message nearset", messageNearest)    

            if (messageNearest){
                //if two dates are equal. time line should be dont display. so it set is 0 
                isTimeLine = compareDate(date, messageNearest.updatedAt) === true ? 0 : 1
                isShowTime = (sender == messageNearest.sender && isTimeLine == false);
            }
            
            if (isShowTime){
                $('#list-message li').last().find('img.avatar').remove()
                $('#list-message li').last().find('.message__content-time').remove()
            }
            // console.log(isTimeLine, renderTimeLine())


            html += (isTimeLine) ? htmlTimeLine() : ''; 
            html += await htmlMessage(sender, message, date, true)
            $('#list-message').append(html)
            scrollChatList()
        }
    })

    socket.on('new user connect', (listRoomOnline)=>{
        console.log('newUserConnetOnlySender', listRoomOnline);
        var userOnline = $('#list-chat-user').find('.list-chat-user-item').toArray();
        
        userOnline.forEach((user)=>{
            if ($.inArray($(user).data('id'), listRoomOnline) != -1){
                $(user).find('.circle').addClass('online');
            }
        })
    })

    //cho những thằng đang online để change status của thằng mới disconnect    
    socket.on('user disconnect', (userOnlineReal)=>{
        console.log('user disconnect ', userOnlineReal)
        var userOnline = $('#list-chat-user').find('.list-chat-user-item .circle.online').toArray();
        userOnline.forEach((user)=>{
            if ($.inArray($(user).data('id'), userOnlineReal) == -1){
                $(user).removeClass('online');
            }
        })
    })

    socket.on('test room online', (listRoomOnline)=>{
        console.log("list room online", listRoomOnline);
    })
})

