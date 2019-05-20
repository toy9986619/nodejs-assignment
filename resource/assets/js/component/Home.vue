<template>
  <div>
    <p>testing</p>
    <p v-if="username">hello, {{ username }}!</p>
    <p v-else>尚未登入</p>

    <div v-if="eventList">
      <ul>
        <li v-for="event in eventList" :key="event.id">
          <!-- {{ event.summary }} {{ event.start.dateTime || event.start.date }} -->
          <event :event="event" />
        </li>
      </ul>
    </div>
    <a href="/api/auth/login">登入</a>
  </div>
</template>

<script>
import event from "./Event.vue";

export default {
  components: {
    event
  },
  
  data() {
    return {
      username: "",
      eventList: []
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
