async function sendData(src, data, onSuccss, onFail) {
    try {
        let response = await fetch(src, {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        let result = await response.json()
        if (result.status === "success") {
            onSuccss(result)
        } else {
            onFail(result)
        }
    } catch (error) {
        console.log(error)
    }
}

async function getdData(src, onSuccss) {
    try {
        let response = await fetch(src, {
            method: "post",
            headers: {"Content-Type": "application/json"},
        })
        let result = await response.json()
        if (result.status === "success") {
            onSuccss(result)
        }
    } catch (error) {
        console.log(error)
    }
}

const egPhoneRegex = /^01[0125]\d{8}$/

document.addEventListener("DOMContentLoaded", () => {
    let editcontainer = document.createElement("div")
    let editForm = document.createElement("form")
    editcontainer.classList = "edit-container"
    editcontainer.appendChild(editForm)
    document.addEventListener("click", (e) => {
        if (e.target === editcontainer) {
            editcontainer.remove()
        }
    })
    let currentPage = window.location.pathname
    let statusMsg = document.querySelector(".status")

    // ===== set location & set user name in home ===== Done
    let user = JSON.parse(localStorage.getItem("userData"))
    // if (!user && !currentPage.includes("login.html")) {
    //     window.location.href = "login.html"
    // }
    // if (user && currentPage.includes("login.html")) {
    //     window.location.href = "index.html"
    // }

    // ===== login ===== Done
    if (currentPage.includes("login.html")) {
        const nameInp = document.querySelector("#username-inp")
        const passInp = document.querySelector("#password-inp")
        const loginForm = document.querySelector("form")
        loginForm.addEventListener("submit" , (e) => {
            e.preventDefault()
            let data = {
                userName: nameInp.value,
                userPass: passInp.value
            }
            if (data.userName.trim() != "" && data.userPass.trim() != "") {
                sendData("api/login.php",
                    data,
                    function (result) {
                        localStorage.setItem("userData", JSON.stringify(result.user))
                        window.location.reload()
                    },
                    function (result) {
                        statusMsg.textContent = result.message
                    }
                )
            } else {
                statusMsg.textContent = "املأ الخانات المطلوبة"
                let inps = [nameInp, passInp]
                inps.forEach(inp => {
                    if (inp.value.trim() === "") {
                        inp.style.border = "1px solid rgba(255, 0, 0, 0.7)"
                    }
                    inp.addEventListener("focus", () => {
                        inp.style.border = "1px solid rgba(0, 0, 0, 0.3)"
                    })
                })
            }
        })
    }

    // ===== logout & seeting ===== Done
    if (currentPage.includes("index.html")) {
        document.querySelector(".user-name").textContent = user.name
        document.addEventListener("click", (e) => {
            // ===== logout ===== Done
            if (e.target === document.getElementById("logout")) {
                localStorage.removeItem("userData")
                window.location.reload()
            }

            // ===== setting ===== (cahnge pass / Done)
            if (e.target === document.querySelector(".setting")) {
                document.body.appendChild(editcontainer)
                editForm.innerHTML = `
                    <input type="text" name="new-pass" id="new-pass" placeholder="new Password">
                    <input type="text" name="re-pass" id="re-pass" placeholder="reEnter">
                    <p class="status"></p>
                    <button class="save btn">حفظ</button>
                `
                editForm.addEventListener("submit" , (e) => {
                    e.preventDefault()
                    let theNewPass = editForm.querySelector("#new-pass").value.trim()
                    let theRePass = editForm.querySelector("#re-pass").value.trim()
                    let data = {
                        newPass: theNewPass,
                        userId: user.id
                    }
                    if (data.newPass != "") {
                        if (theNewPass === theRePass) {
                            sendData("api/setting.php",
                                data,
                                (result) => {
                                    editForm.querySelector(".status").textContent = result.message
                                },
                                (result) => {
                                    editForm.querySelector(".status").textContent = result.message
                                }
                            )   
                        } else {
                            editForm.querySelector(".status").textContent = "اعد ادخال كلمة السر الجديدة"
                        }
                    } else {
                        editForm.querySelector(".status").textContent = "املأ الخانات المطلوبة"
                        let inps = [editForm.querySelector("#re-pass"), editForm.querySelector("#new-pass")]
                        inps.forEach(inp => {
                        if (inp.value.trim() === "") {
                                inp.style.border = "1px solid rgba(255, 0, 0, 0.7)"
                            }
                            inp.addEventListener("focus", () => {
                                inp.style.border = "1px solid rgba(0, 0, 0, 0.3)"
                            })
                        })
                    }
                })
            }
        })
    }

    // ===== add client ===== Done
    if (currentPage.includes("add_client.html")) {
        const addClientForm = document.querySelector("#add-client")
        let nameInp = document.querySelector("#add-name")
        let phoneeInp = document.querySelector("#add-phone")
        let orderInp = document.querySelector("#add-order")
        let notesInp = document.querySelector("#add-note")
        addClientForm.addEventListener("submit", (e) => {
            e.preventDefault()
            let data = {
                clientName: nameInp.value,
                clientPhone: phoneeInp.value,
                clientOrder: orderInp.value,
                clientNotes: notesInp.value,
                user: user.name,
                department:user.department,
                team: user.team
            }
            if (data.clientName.trim() != "" && data.clientPhone.trim() != "" , data.clientOrder.trim() != "") {
                if (egPhoneRegex.test(data.clientPhone)) {
                    sendData("api/add_client.php",
                        data,
                        (result) => {
                            statusMsg.textContent = result.message
                        },
                        (result) => {
                            statusMsg.textContent = result.message
                        }
                    )
                } else {
                    phoneeInp.style.border = "1px solid rgba(255, 0, 0, 0.7)"
                    phoneeInp.addEventListener("focus", () => {
                        phoneeInp.style.border = "1px solid rgba(0, 0, 0, 0.3)"
                    })
                    statusMsg.textContent = "ادخل رقم هاتف صحيح"
                }
            } else {
                statusMsg.textContent = "املأ الخانات المطلوبة"
                let errorInps = [nameInp, phoneeInp, orderInp]
                errorInps.forEach(inp => {
                    if (inp.value.trim() === "") {
                        inp.style.border = "1px solid rgba(255, 0, 0, 0.7)"
                    }
                    inp.addEventListener("focus", () => {
                        inp.style.border = "1px solid rgba(0, 0, 0, 0.3)"
                    })
                })
            }
        })
    }

    // ===== show clients & edit clients & clients searsh ===== Done
    if (currentPage.includes("viu-clients.html")) {
        const clientsContainer = document.querySelector(".clients-container")
        const searchInp = document.getElementById("clients-search")

        // ===== show clients ===== Done
        getdData("api/viu_clients.php", (result) => {
            let clients = result.clients
            clients.forEach(client => {
                let updatedAt = client.last_update
                let dateOpj = new Date(updatedAt.replace(" " , "T"))
                let day = dateOpj.getDate().toString().padStart(2,'0')
                let month = (dateOpj.getMonth() + 1).toString().padStart(2,'0')
                let year = dateOpj.getFullYear()
                let time = dateOpj.toLocaleTimeString('en-US' , {hour: '2-digit', minute: '2-digit', hour12: true})
                let card = document.createElement("div")
                card.classList = "card hidden"
                card.innerHTML = `

                    <h3 lang="ar" dir="rtl" class="out name">${client.name}</h3>
                    <p lang="ar" dir="rtl" class="out phone">${client.phone}</p>
                    <div class="more hidden">
                        <p lang="ar" dir="rtl" class="out id" style="display: none;">${client.id}</p>
                        <p lang="ar" dir="rtl" class="out order">${client.client_order}</p>
                        <p lang="ar" dir="rtl" class="out notes">${client.notes}</p>
                        <p lang="ar" dir="rtl" class="out user-name">${client.added_by}</p>
                        <p lang="ar" dir="rtl" class="out team">${client.team}</p>
                        <p lang="ar" dir="rtl" class="out department">${client.department}</p>
                        <p lang="ar" dir="rtl" class="out last-update">اخر تحديث : ${day}/${month}/${year} | الساعة ${time} </p>
                        <p lang="ar" dir="rtl" class="out status">${client.state}</p>
                        <button class="btn edit">تعديل</button>
                        <button class="btn update">تحديث</button>
                    </div>
                `
                clientsContainer.prepend(card)
                if (user.name === card.querySelector(".user-name").textContent && user.role === "user") {
                    card.classList.remove("hidden")
                    card.querySelector(".user-name").style.display = "none"
                    card.querySelector(".team").style.display = "none"
                    card.querySelector(".department").style.display = "none"
                } else if (user.team === card.querySelector(".team").textContent && user.role === "team_leader") {
                    card.classList.remove("hidden")
                    card.querySelector(".team").style.display = "none"
                    card.querySelector(".department").style.display = "none"
                } else if (user.department === card.querySelector(".department").textContent && user.role === "manager") {
                    card.classList.remove("hidden")
                    card.querySelector(".department").style.display = "none"
                } else if (user.role === "admin") {
                    card.classList.remove("hidden")
                }
                card.querySelectorAll(".out").forEach(val => {
                    if (val.textContent === "") {
                        val.style.display = "none"
                    }   
                })
            })
        })
        clientsContainer.addEventListener("click", (e) => {
            let card = e.target.closest(".card")
            if (!card) return

            // ===== edit Client ===== Done
            if (e.target.classList.contains("edit")) {
                let selectedClient = e.target.parentElement.parentElement
                let oldId = selectedClient.querySelector(".id").textContent
                let oldName = selectedClient.querySelector(".name").textContent
                let oldPhone = selectedClient.querySelector(".phone").textContent
                let oldOrder = selectedClient.querySelector(".order").textContent
                let oldNotes = selectedClient.querySelector(".notes").textContent
                let oldUser = selectedClient.querySelector(".user-name").textContent
                let oldTeam = selectedClient.querySelector(".team").textContent
                let oldDepartment = selectedClient.querySelector(".department").textContent
                let oldState = selectedClient.querySelector(".status").textContent
                    
                document.body.appendChild(editcontainer)
                editForm.innerHTML =`
                <input type="text" class="inp" name="new-name" id="new-name" value="${oldName}" lang="ar" dir="rtl">
                <input type="text" class="inp" name="new-phone" id="new-phone" value="${oldPhone}" lang="ar" dir="rtl">
                <input type="text" class="inp" name="new-order" id="new-order" value="${oldOrder}" lang="ar" dir="rtl">
                <input type="text" class="inp" name="new-notes" id="new-notes" value="${oldNotes}" lang="ar" dir="rtl">
                <input type="button" class="inp" name="new-user-name" id="new-user" value="${oldUser}" lang="ar" dir="rtl">
                <input type="button" class="inp" name="new-team" id="new-team" value="${oldTeam}" lang="ar" dir="rtl">
                <input type="button" class="inp" name="new-department" id="new-department" value="${oldDepartment}" lang="ar" dir="rtl">
                <input type="button" class="inp" name="new-status" id="new-state" value="${oldState}" lang="ar" dir="rtl">
                <p class="status"></p>
                <button class="btn">حفظ</button>
                `

                if (user.role === "user") {
                    editForm.querySelector("#new-user").style.display = "none"
                    editForm.querySelector("#new-team").style.display = "none"
                    editForm.querySelector("#new-department").style.display = "none"
                } else if (user.role === "team_leader") {
                    editForm.querySelector("#new-team").style.display = "none"
                    editForm.querySelector("#new-department").style.display = "none"
                } else if (user.role === "manager") {
                    editForm.querySelector("#new-department").style.display = "none"
                }
                
                document.getElementById("new-user").addEventListener("click", () => {
                    getdData("api/get_users.php" , (result) => {
                        let users = result.users
                        let list = document.createElement("div")
                        list.classList = "list"
                        editcontainer.appendChild(list)
                        Object.values(users).forEach(user => {
                            let userName = document.createElement("h3")
                            list.appendChild(userName)
                            userName.textContent = user.name
                            userName.addEventListener("click" , () => {
                                document.getElementById("new-user").value = user.name
                                document.getElementById("new-team").value = user.team
                                document.getElementById("new-department").value = user.department
                                list.remove()
                            })
                        })
                        
                    })
                })

                document.getElementById("new-state").addEventListener("click", () => {
                    let list = document.createElement("div")
                    list.classList = "list"
                    editcontainer.appendChild(list)
                    list.innerHTML = `
                                <h3>متابعة</h3>
                                <h3>عربون</h3>
                                <h3>نفذ</h3>
                                <h3>مبينفذش</h3>
                    `
                    list.querySelectorAll(".list h3").forEach(state => {
                        state.addEventListener("click" , () => {
                            editForm.querySelector("#new-state").value = state.textContent
                            list.remove()
                        })
                    })
                })
                editForm.addEventListener("submit" , (e) => {
                    e.preventDefault()
                    let data = {
                        newName: editForm.querySelector("#new-name").value,
                        newPhone: editForm.querySelector("#new-phone").value,
                        newOrder: editForm.querySelector("#new-order").value,
                        newNotes: editForm.querySelector("#new-notes").value,
                        newUser: editForm.querySelector("#new-user").value,
                        newTeam: editForm.querySelector("#new-team").value,
                        newDepartment: editForm.querySelector("#new-department").value,
                        newState: editForm.querySelector("#new-state").value,
                        oldId,
                        oldPhone
                    }
                    if (data.newName != "" || data.newPhone != "" || data.newOrder != "") {
                        sendData("api/update_client.php",
                            data,
                            (result) => {
                                editForm.querySelector(".status").textContent = result.message
                                selectedClient.remove()
                            }, (result) => {
                                editForm.querySelector(".status").textContent = result.message
                            }
                        )
                    }
                })

            } else if (e.target.classList.contains("update")) {
                return
            } else {
                let more = card.querySelector(".more")
                more.classList.toggle("hidden")
            }
        })

        if (editForm) {
            editForm.addEventListener("submit" , () => {
                let data = {
                    newName: editForm.querySelector("#new-name"),
                    newPhone: editForm.querySelector("#new-phone"),
                    newOrder: editForm.querySelector("#new-order"),
                    newNotes: editForm.querySelector("#new-notes"),
                    newUser: editForm.querySelector("#new-user"),
                    newTeam: editForm.querySelector("#new-team"),
                    newDepartment: editForm.querySelector("#new-department"),
                    newState: editForm.querySelector("#new-state")
                }
            })
        }
        // ===== search ===== Done
        searchInp.addEventListener("input" , () => {
            clientsContainer.querySelectorAll(".card").forEach(client => {
                if (client.textContent.includes(searchInp.value)) {
                    client.classList.remove("hide")
                } else {
                    client.classList.add("hide")
                }
            })
        })
    }

    // ===== add unit ===== Done
    if (currentPage.includes("add_unit.html")) {
        const addUnitForm = document.getElementById("add-units")
        let districtInp = document.getElementById("add-district")
        let blockInp = document.getElementById("add-block")
        let unitInp = document.getElementById("add-unit")
        let spaceInp = document.getElementById("add-space")
        let priceInp = document.getElementById("add-price")
        let notesInp = document.getElementById("add-notes")

        addUnitForm.addEventListener("submit", (e) => {
            e.preventDefault()
            let data = {
                district: districtInp.value,
                block: blockInp.value,
                unit: unitInp.value,
                space: spaceInp.value,
                price: priceInp.value,
                notes: notesInp.value,
                addedBy: user.name,
                department: user.department,
                role: user.role
            }
            let inps = addUnitForm.querySelectorAll(".inp:not(#add-notes)")
            let fildsFull = true
            inps.forEach(inp => {
                if (inp.value.trim() === "") {
                    fildsFull = false
                    inp.style.border = "1px solid rgba(255, 0, 0, 0.7)"
                }
                inp.addEventListener("focus", () => {
                    inp.style.border = "1px solid rgba(0, 0, 0, 0.3)"
                })
            })
            if (fildsFull) {
                sendData("api/add_unit.php",
                    data,
                    (result) => {
                        statusMsg.textContent = result.message
                    },
                    (result) => {
                        statusMsg.textContent = result.message
                    }
                )
            } else {
                statusMsg.textContent = "املأ الخانات المطلوبة"
            }
        })
    }

    // ===== show units & unites search & sort unites & edit unites =====
    if (currentPage.includes("viu_units.html")) {
        const unitsTable = document.getElementById("unites")
        const searchInp = document.getElementById("unites-search")

        // ===== show units ===== Done
        getdData("api/viu-units.php", (result) => {
            let units = result.units
            units.forEach(unit => {
                let row = document.createElement("tr")
                row.classList = "hidden unit"
                let thePrice = Number(unit.price)
                row.innerHTML = `
                    <td>${unit.district}</td>
                    <td class="block">${unit.block}</td>
                    <td class="unit-n">${unit.unit}</td>
                    <td>${unit.space}</td>
                    <td>${thePrice.toLocaleString()}</td>
                    <td><button>${unit.added_by}</button></td>
                `
                unitsTable.appendChild(row)
                if (unit.status === "جاهز") {
                    row.style.backgroundColor = "rgba(0, 0, 0, 0.2)"
                } else if (unit.status = "عربون") {
                    row.style.backgroundColor = "rgba(255, 255, 0, 0.2)"
                } else if (unit.status = "لغى البيع") {
                    row.style.display = "none"
                } else if (unit.status = "تم التنفيذ") {
                    row.style.display = "none"
                }

                if (user.department === unit.department || user.role === "admin") {
                    row.classList.remove("hidden")
                }
            })
        })

        // ===== search unites ===== Done
        searchInp.addEventListener("input" , () => {
            unitsTable.querySelectorAll(".unit").forEach(unit => {
                if (unit.textContent.includes(searchInp.value)) {
                    unit.classList.remove("hide")
                } else {
                    unit.classList.add("hide")
                }
            })
        })

        //  ===== sort unites ===== 
        let headers = document.getElementById("units-container").querySelectorAll("th")
        let sortDir = true

        headers.forEach((header, index) => {
            header.addEventListener("click" , () => {
                let rows = Array.from(unitsTable.querySelectorAll("tr"))

                rows.sort((a,b) => {
                    let A = a.children[index].textContent.trim()
                    let B = b.children[index].textContent.trim()

                    let aVal = isNaN(A) ? A : parseFloat(A)
                    let bVal = isNaN(B) ? B : parseFloat(B)

                    if (aVal > bVal) return sortDir ? -1 : 1
                    if (aVal < bVal) return sortDir ? 1 : -1
                    return 0
                })
                sortDir = !sortDir

                unitsTable.innerHTML = ""
                rows.forEach(row => unitsTable.appendChild(row))
            })
        })
    }

})
