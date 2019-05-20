<template>
  <modal>
    <div slot="header">
      <h3>詳細資訊</h3>
    </div>

    <div slot="body" v-if="!editMode">
      <div class="option">
        <button class="modal-default-button" @click="editMode = true">編輯</button>
      </div>

      <div class="form-container">
        <div>標題: {{ eventData.summary }}</div>
        <div>時間: {{ eventData.start.dateTime || eventData.start.date }}</div>
        <div>地點: {{ eventData.location }}</div>
        <div>內容: {{ eventData.description }}</div>
      </div>
    </div>

    <div slot="body" v-if="editMode">
      <div class="option">
        <button class="modal-default-button" @click="editMode = false">返回</button>
      </div>

      <div class="form-container">
        <div>
          <span>標題:</span>
          <input v-model="eventData.summary">
        </div>
        <div>
          <span>時間:</span>
          <input v-if="eventData.start.date" v-model="eventData.start.date">
          <input v-if="eventData.start.dateTime" v-model="eventData.start.dateTime">
        </div>
        <div>
          <span>地點:</span>
          <input v-model="eventData.location">
        </div>
        <div>
          <span>內容:</span>
          <textarea v-model="eventData.description"></textarea>
        </div>
      </div>
    </div>

    <div slot="footer" v-if="!editMode">
      <button class="modal-default-button" @click="$emit('close')">確定</button>
    </div>

    <div slot="footer" v-if="editMode">
      <button class="modal-default-button" @click="updateEvent()">保存</button>
      <button class="modal-default-button" @click="$emit('close')">取消</button>
    </div>
  </modal>
</template>

<script>
import modal from "./Modal.vue";

export default {
  components: {
    modal
  },

  props: {
    event: Object,
    createMode: Boolean
  },

  data() {
    return {
      editMode: false,
      eventData: Object.assign({}, this.event)
    };
  },

  methods: {
    async updateEvent() {
      axios
        .patch(`/api/calendar/event/${this.eventData.id}`, {
          event: this.eventData
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    async insertEvent() {
      axios.post(`/api/calendar/event`, {

      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    }
  },

  mounted() {
    // this.eventData = this.event;
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin-top: 10px;
}
</style>
