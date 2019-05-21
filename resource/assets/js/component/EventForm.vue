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
        <button class="modal-default-button" v-if="!createMode" @click="editMode = false">返回</button>
      </div>

      <div class="form-container">
        <div>
          <span>標題:</span>
          <input v-model="eventData.summary">
        </div>
        <div>
          <span>時間</span>
          <div>
            <label>整天</label>
            <input type="checkbox" v-model="allDay">
          </div>
          <div>開始</div>
          <datepicker v-if="allDay" format="YYYY-MM-DD" v-model="startDate" key="startDate"/>
          <datepicker v-else format="YYYY-MM-DD H:i:s" v-model="startTime" key="startTime"/>
          <div>結束</div>
          <datepicker v-if="allDay" format="YYYY-MM-DD" v-model="endDate" key="endDate"/>
          <datepicker v-else format="YYYY-MM-DD H:i:s" v-model="endTime" key="endTime"/>
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
      <button class="modal-default-button" v-if="createMode == false" @click="updateEvent()">保存</button>
      <button class="modal-default-button" v-if="createMode == true" @click="insertEvent()">新增</button>
      <button class="modal-default-button" @click="$emit('close')">取消</button>
    </div>
  </modal>
</template>

<script>
import Modal from "./Modal.vue";
import Datepicker from "vuejs-datetimepicker";

export default {
  components: {
    Modal,
    Datepicker
  },

  props: {
    event: Object,
    createMode: Boolean
  },

  data() {
    return {
      editMode: this.createMode | false,
      eventData: Object.assign({}, this.event),
      startTime: this.event.start.dateTime
        ? `${this.parseEventToDate(
            this.event.start.dateTime
          )} ${this.parseEventToTime(this.event.start.dateTime)}`
        : `${this.event.start.date} 00:00:00`,
      endTime: this.event.end.dateTime
        ? `${this.parseEventToDate(
            this.event.end.dateTime
          )} ${this.parseEventToTime(this.event.end.dateTime)}`
        : `${this.event.end.date} 00:00:00`,
      startDate: this.event.start.dateTime
        ? this.parseEventToDate(this.event.start.dateTime)
        : this.event.start.date,
      endDate: this.event.end.dateTime
        ? this.parseEventToDate(this.event.end.dateTime)
        : `${this.event.end.date.slice(0, 8)}${this.event.end.date.slice(8) -1 }`,
      allDay: this.event.start.date ? true : false
    };
  },

  watch: {
    startTime(value) {
      this.startDate = value.slice(0, 10);
    },

    endTime(value) {
      this.endDate = value.slice(0, 10);
    },

    startDate(value) {
      this.startTime = `${value} ${this.startTime.slice(11, this.startTime.length)}`;
    },

    endDate(value) {
      this.endTime = `${value} ${this.endTime.slice(11, this.endTime.length)}`;
    }

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
      if (this.allDay) {
        this.eventData.start = {
          date: this.startDate
        };
        this.eventData.end = {
          date: this.endDate
        }
      }
      
      axios
        .post(`/api/calendar/event`, {
          event: this.eventData
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },

    parseEventToDate(eventTime) {
      if (eventTime.includes("T")) {
        const date = eventTime.slice(0, eventTime.indexOf("T"));

        return date;
      }

      return eventTime;
    },

    parseEventToTime(eventTime) {
      if (eventTime.includes("T")) {
        const time = eventTime.slice(
          eventTime.indexOf("T") + 1,
          eventTime.indexOf("+08:00")
        );

        return time;
      }

      return "00:00:00";
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin-top: 10px;
}
</style>
