<template>
  <modal>
    <template v-if="!editMode">
      <div slot="header">
        <h3>詳細資訊</h3>
      </div>

      <div slot="body">
        <div class="option">
          <button class="modal-default-button" @click="editMode = true">編輯</button>
        </div>

        <div class="form-container">
          <div class="title">標題: {{ eventData.summary }}</div>
          <div class="time">時間: {{ eventData.start.dateTime || eventData.start.date }}</div>
          <div class="location">地點: {{ eventData.location }}</div>
          <div class="contnet">內容: {{ eventData.description }}</div>
        </div>
      </div>

      <div slot="footer">
        <button class="modal-default-button" @click="$emit('close')">確定</button>
      </div>
    </template>

    <template v-else>
      <div slot="header">
        <h3>編輯事項</h3>
      </div>

      <div slot="body">
        <div class="option">
          <button class="modal-default-button" v-if="!createMode" @click="editMode = false">返回</button>
        </div>

        <div class="form-container">
          <div class="title">
            <div>標題:</div>
            <input type="text" v-model="eventData.summary">
          </div>
          <div class="time">
            <div>
              <span>時間</span>
              <span>
                <span>整天</span>
                <input type="checkbox" v-model="allDay">
              </span>
            </div>
            <div>開始</div>
            <datepicker v-if="allDay" format="YYYY-MM-DD" v-model="startDate" key="startDate"/>
            <datepicker v-else format="YYYY-MM-DD H:i:s" v-model="startTime" key="startTime"/>
            <div>結束</div>
            <datepicker v-if="allDay" format="YYYY-MM-DD" v-model="endDate" key="endDate"/>
            <datepicker v-else format="YYYY-MM-DD H:i:s" v-model="endTime" key="endTime"/>
          </div>
          <div class="location">
            <div>地點:</div>
            <input type="text" v-model="eventData.location">
          </div>
          <div class="content">
            <div>內容:</div>
            <textarea v-model="eventData.description"></textarea>
          </div>
        </div>
      </div>

      <div slot="footer">
        <button class="modal-default-button" v-if="createMode == false" @click="updateEvent()">保存</button>
        <button class="modal-default-button" v-if="createMode == true" @click="insertEvent()">新增</button>
        <button class="modal-default-button" @click="$emit('close')">取消</button>
      </div>
    </template>
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
    createMode: Boolean,
    index: Number
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
        : `${this.event.end.date.slice(0, 8)}${this.event.end.date.slice(8) -
            1}`,
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
      this.startTime = `${value} ${this.startTime.slice(
        11,
        this.startTime.length
      )}`;
    },

    endDate(value) {
      this.endTime = `${value} ${this.endTime.slice(11, this.endTime.length)}`;
    }
  },

  methods: {
    async updateEvent() {
      this.parseTimeToEvent();

      axios
        .put(`/api/calendar/event/${this.eventData.id}`, {
          event: this.eventData
        })
        .then(res => {
          console.log(res);
          this.$emit("update");
          this.$emit("close");
        })
        .catch(err => {
          console.log(err);
        });
    },

    async insertEvent() {
      this.parseTimeToEvent();

      axios
        .post(`/api/calendar/event`, {
          event: this.eventData
        })
        .then(res => {
          console.log(res);
          this.$emit("update");
          this.$emit("close");
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
    },

    parseTimeToEvent() {
      if (this.allDay) {
        this.eventData.start = {
          date: this.startDate
        };
        this.eventData.end = {
          date: this.endDate
        };
      } else {
        const startTime = `${this.startTime.slice(
          0,
          10
        )}T${this.startTime.slice(11)}+08:00`;
        const endTime = `${this.endTime.slice(0, 10)}T${this.endTime.slice(
          11
        )}+08:00`;

        this.eventData.start = {
          dateTime: startTime
        };
        this.eventData.end = {
          dateTime: endTime
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-container {
  margin-top: 10px;
}

.title, .time, .location, .content {
  margin-bottom: 10px;
}

input[type="text"] {
  width: 100%;
}

textarea {
  width: 100%;
}


</style>
