<template>
  <div class="notFound">
  <h1>{{msg}}</h1>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      msg: '你访问的页面不存在'
    }
  }
}
</script>


<style scoped>

</style>