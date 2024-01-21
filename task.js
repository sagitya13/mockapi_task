class API {
    static instance;

    constructor() {
        if (API.instance) {
            return API.instance;
        }
        API.instance = this;
    }

    async fetchData() {
        const response = await fetch('https://65ad153dadbd5aa31be00f7a.mockapi.io/api/task');
        const data = await response.json();
        return data;
    }

    async addData(data) {
        const response = await fetch('https://65ad153dadbd5aa31be00f7a.mockapi.io/api/task', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const result = await response.json();
        return result;
    }

    async deleteData(id) {
        const response = await fetch(`https://65ad153dadbd5aa31be00f7a.mockapi.io/api/task/${id}`, { method: 'DELETE', });
        return response;
    }
}

class UI {
    static async displayData() {
        const data = await new API().fetchData();
        const dataBody = document.getElementById('dataBody');
        dataBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td><img src="${item.avatar || 'https://65ad153dadbd5aa31be00f7a.mockapi.io/api/task/avatar/default'}" alt="Avatar" class="avatar"></td>
                <td>${item.title}</td>
                <td>
                    <button onclick="UI.editData(${item.id}, '${item.title}')">Edit</button>
                    <button onclick="UI.confirmDelete(${item.id})">Delete</button>
                </td>
            `;
            dataBody.appendChild(row);
        });
    }

    static async editData(id, title) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const dataForm = document.getElementById('dataForm');
        const submitBtn = document.getElementById('submitBtn');
        const personNameInput = document.getElementById('personName');

        modalTitle.textContent = 'Edit Record';
        personNameInput.value = title;

        modal.style.display = 'block';

        dataForm.onsubmit = async function (e) {
            e.preventDefault();
            const newPersonName = personNameInput.value;

            await new API().addData({ id, title: newPersonName });

            closeModal();
            UI.displayData();
        };
    }

    static async confirmDelete(id) {
        const confirmDelete = confirm('Are you sure you want to delete this record?');

        if (confirmDelete) {
            await new API().deleteData(id);
            UI.displayData();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('addBtn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close');
    const dataForm = document.getElementById('dataForm');
    const submitBtn = document.getElementById('submitBtn');

    addBtn.addEventListener('click', function () {
        const modalTitle = document.getElementById('modalTitle');
        const personNameInput = document.getElementById('personName');

        modalTitle.textContent = 'Add Record';
        personNameInput.value = '';

        modal.style.display = 'block';

        dataForm.onsubmit = async function (e) {
            e.preventDefault();
            const newPersonName = personNameInput.value;

            await new API().addData({ title: newPersonName });

            closeModal();
            UI.displayData();
        };
    });

    closeModalBtn.onclick = function () {
        closeModal();
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    async function closeModal() {
        modal.style.display = 'none';
        await UI.displayData();
    }

    UI.displayData();
});