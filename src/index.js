import api from "./services/api";

class TaskList {
  constructor() {
    this.titleInput = document.getElementById("messageTitle");
    this.editTitleInput = document.getElementById("editMessageTitle");
    this.messageInput = document.getElementById("messageBody");
    this.editMessageInput = document.getElementById("editMessageBody");
    this.addBtn = document.getElementById("addButton");
    this.btnSaveEdit = document.getElementById("saveEdit");
    this.scrapsField = document.getElementById("scrapsField");

    this.scraps = [];

    this.getScraps();

    this.registerAddScrapBtnEvent();
  }

  async getScraps() {
    const { data:scraps } = await api.get("/scrapbook");

    this.scraps = scraps;
    this.renderScraps();
  }

  registerAddScrapBtnEvent() {
    this.addBtn.onclick = () => this.addNewScrap();
  }

  setButtonEvents() {
    document.querySelectorAll(".delete-button").forEach((item) => {
      item.onclick = (event) => this.deleteScrap(event);
    });

    document.querySelectorAll(".edit-button").forEach((item) => {
      item.onclick = (event) => this.openEditModal(event);
    });
  }

  renderScraps() {
    this.scrapsField.innerHTML = "";

    for (const scrap of this.scraps) {
      const cardHtml = this.createScrapCard(
        scrap.id,
        scrap.title,
        scrap.message
      );

      this.insertHtml(cardHtml);
    }

    this.setButtonEvents();
  }

  async addNewScrap() {
    const newTitle = this.titleInput.value;
    const newMessage = this.messageInput.value;

    this.titleInput.value = "";
    this.messageInput.value = "";

    const { 
      data: {id, title, message} 
    } = await api.post("/scraps", {title: newTitle, message: newMessage});

    this.scraps.push({ id, title, message });

    this.renderScraps();
  }

  async deleteScrap(event) {
    try {
      event.path[2].remove();

    const scrapId = event.path[2].getAttribute("id-scrap");

    await api.delete(`scraps/${scrapId}`);

    const scrapIndex = this.scraps.findIndex((item) => {
      return item.id == scrapId;
    });

    this.scraps.splice(scrapIndex, 1);
    } 
    catch(error) {
      console.log(error);
    }
  }

  insertHtml(html) {
    this.scrapsField.innerHTML += html;
  }

  openEditModal(event) {
    $("#editModal").modal("toggle");

    const scrapId = event.path[2].getAttribute("id-scrap");

    const scrapIndex = this.scraps.findIndex((item) => {
      return item.id == scrapId;
    });

    this.editTitleInput.value = this.scraps[scrapIndex].title;
    this.editMessageInput.value = this.scraps[scrapIndex].message;

    this.btnSaveEdit.onclick = () => this.saveChanges(scrapIndex, scrapId);
  }

  async saveChanges(scrapIndex, scrapId) {
    try {
      let title = this.editTitleInput.value;
      let message = this.editMessageInput.value;

      const { data: scrap } = await api.put(`/scraps/${scrapId}`, {
        title,
        message
      });

      this.scraps[scrapIndex] = scrap;

      console.log(this.scraps);
      this.renderScraps();
      $("#editModal").modal("hide");
    } 
    catch(error) {
      console.log(error);
    }
  }

  createScrapCard(id, title, message) {
    return `
    <div class="message-cards card text-white bg-dark m-2 col-3" id-scrap="${id}">
      <div class="card-header font-weight-bold">${title}</div>
      <div class="card-body">
        <p class="card-text">
          ${message}
        </p>
      </div>
      <div class="w-100 d-flex justify-content-end pr-2 pb-2">
        <button class="btn btn-danger mr-1 delete-button">Deletar</button>
        <button class="btn btn-info edit-button">Editar</button>
      </div>
    </div>
    `;
  }
}

new TaskList();


