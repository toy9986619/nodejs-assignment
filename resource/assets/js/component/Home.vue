<template>
  <div class="container">
    <div class="row justify-content-md-center mt-5">
      <div class="col-md-8">
        <div class="card" v-if="isLogin">
          <div class="card-header">
            <span>最近 20 筆待辦事項</span>
            <div class="botton-menu">
              <button v-if="username" @click="showInsertModal = true">新增</button>
              <button @click="getCalendarList">更新</button>
            </div>
            <event-form
              v-if="showInsertModal"
              @close="showInsertModal = false"
              @update="updateEventItem"
              :event="newEvent"
              :createMode="true"
            />
          </div>
          <div class="card-body">
            <ul class="item-list">
              <li v-for="(event, index) in eventList" :key="event.id">
                <event :event="event" :index="index" @update="updateEventItem"/>
              </li>
            </ul>
          </div>
        </div>

        <div class="card" v-else>
          <div class="card-header">尚未登入</div>
          <div class="card-body">
            請先進行登入，獲取待辦事項內容
          </div>
        </div>
      </div>
    </div>
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
      showInsertModal: false,
      eventList: [],
      syncToken: "",
      newEvent: {
        start: {
          date: this.getDate()
        },
        end: {
          date: this.getDate(1)
        }
      }
    };
  },

  computed: {
    username() {
      return this.$store.state.user;
    },
    
    isLogin() {
      return this.$store.state.isLogin;
    }
  },

  methods: {
    async getLoginUser() {
      try {
        const res = await fetch("/api/auth/check_login");
        const data = await res.json();
        if (data.username) {
          this.$store.commit("login", data.username);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async getCalendarList() {
      if (this.username) {
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

    getDate(shiftDay = 0) {
      const time = new Date(Date.now());
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate() + shiftDay;

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

<style lang="scss" scoped>
.card-header {
  display: flex;
}

.botton-menu {
  margin-right: 20px;
  margin-left: auto;

  > button {
    margin-right: 10px;
  }
}

.item-list {
  padding-inline-start: 0px;
  list-style: none;

  > li:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
}
</style>
