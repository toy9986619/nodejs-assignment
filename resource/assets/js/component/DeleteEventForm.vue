<template>
  <modal>
    <div slot="header">
      <h3>刪除事項</h3>
    </div>

    <div slot="body">
      確定刪除「{{ event.summary }}」事件嗎？
      行動將無法回朔
    </div>

    <div slot="footer">
      <button @click="deleteEvent">刪除</button>
      <button @click="$emit('close')">取消</button>
    </div>
  </modal>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  components: {
    Modal
  },

  props: {
    event: Object,
  },

  data() {
    return {

    };
  },
  
  methods: {
    deleteEvent() {
      axios
        .delete(`/api/calendar/event/${this.event.id}`)
        .then(res => {
          console.log("deleted complete");
          this.$emit("update");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
