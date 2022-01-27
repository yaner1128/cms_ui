<template>
  <div class='home'>
    <img alt='Vue logo' src='../assets/logo.png'>
    <h1>{{title}}</h1>
    <ul>
      <li v-for="(item,index) in userList" :key="index">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { getUserList } from '@/api/userList'

export default defineComponent({
  name: 'Home',
  components: {},
  setup () {
    // axios.get('/api/userList').then(res => {
    //   console.log(res)
    // })
    // getUserList().then(res => {
    //   console.log(res.data.data)
    //   userList = res.data.data
    // })
    const title = ref('test')
    let userList:{id:number, name:string, url:string}[] = []
    getUserList().then(res => {
      userList = res.data.data
      console.log('*****userList*****', userList)

      title.value = '测试'
    })
    return {
      userList, title
    }
  }
})
</script>
