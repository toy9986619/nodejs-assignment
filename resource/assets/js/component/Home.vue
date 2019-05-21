<template>
  <div>
    <p>testing</p>
    <p v-if="username">hello, {{ username }}!</p>
    <p v-else>尚未登入</p>

    <div v-if="eventList">
      <button v-if="username" @click="showInsertModal = true">新增</button>
      <event-form
        v-if="showInsertModal"
        @close="showInsertModal = false"
        :event="newEvent"
        :createMode="true"
      />

      <ul>
        <li v-for="event in eventList" :key="event.id">
          <event :event="event" :key="event.id"/>
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

    async getCalanderList() {
      if (this.username) {
        try {
          const res = await fetch("/api/calendar/");
          const data = await res.json();
          if (data.events) {
            this.eventList = data.events;
          }
        } catch (err) {
          console.log(err);
        }
      }
    },

    getNowDate() {
      const time = new Date(Date.now());
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();

      if (month < 10)
        month = `0${month}`;
      
      if (date < 10)
        date = `0${date}`;

      return `${year}-${month}-${date}`;
    }

    // async getEventDetails(eventId) {
    //   try {
    //     const res = await fetch(`/api/calendar/event/${eventId}`);
    //     const data = await res.json();

    //     console.log(data);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  },

  async mounted() {
    await this.getLoginUser();
    await this.getCalanderList();
  }
};
</script>

<style>
</style>
