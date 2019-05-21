<template>
  <div>
    <p>testing</p>
    <p v-if="username">hello, {{ username }}!</p>
    <p v-else>尚未登入</p>

    <div v-if="eventList">
      <button v-if="username" @click="showInsertModal = true">新增</button>
      <button @click="getCalendarList">更新</button>
      <event-form
        v-if="showInsertModal"
        @close="showInsertModal = false"
        @update="updateEventItem"
        :event="newEvent"
        :createMode="true"
      />

      <ul>
        <li v-for="(event, index) in eventList" :key="event.id">
          <event :event="event" :index="index" @update="updateEventItem"/>
        </li>
      </ul>
    </div>
    <a href="/api/auth/login">登入</a>
  </div>
</template>

<script>
import Event from "./Event.vue";
import EventForm from "./EventForm.vue";

export default {
  components: {
    Event,
    EventForm
  },

  data() {
    return {
      username: "",
      showInsertModal: false,
      eventList: [],
      syncToken: "",
      newEvent: {
        start: {
          date: this.getNowDate()
        },
        end: {
          date: this.getNowDate()
        }
      }
    };
  },

  methods: {
    async getLoginUser() {
      try {
        const res = await fetch("/api/auth/check_login");
        const data = await res.json();
        if (data.username) {
          this.username = data.username;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async getCalendarList() {
      if (this.username) {
        console.log("getCalendarList");
        axios
          .get("/api/calendar/")
          .then(res => {
            const data = res.data;

            if (data.events) {
              this.eventList = data.events;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },

    getNowDate() {
      const time = new Date(Date.now());
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();

      if (month < 10) month = `0${month}`;

      if (date < 10) date = `0${date}`;

      return `${year}-${month}-${date}`;
    },

    updateEventItem() {
      console.log("handle");
      this.getCalendarList();
    }
  },

  async mounted() {
    await this.getLoginUser();
    await this.getCalendarList();
  }
};
</script>

<style>
</style>
