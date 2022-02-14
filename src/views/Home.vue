<template>
  <div class='home'>
    1111
    <h1>{{title}}</h1>
    <ul>
      <li v-for="(item,index) in userList" :key="index">
        {{item.name}}--{{item.url}}
      </li>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { getList } from '@/api/userList'

export default defineComponent({
  name: 'Home',
  components: {},
  setup () {
    getList().then(res => {
      console.log(res)
    })
    const title = ref('test')
    const userList = ref<any>([])

    // let userList:{id:number, name:string, url:string}[] = []
    return {
      userList, title
    }
  }
})
</script>
