<template>
  <div class="adminTop">
    <app-header></app-header>
    <!-- tab list -->
    <div class="adminTopTabs">
      <ul>
        <li @click="changeTab(1)" class="text-dark" :class="{ 'is-active': selectAdminCurrentList }">수질 리스트</li>
        <li @click="changeTab(2)" class="text-dark" :class="{ 'is-active': selectAdminAlerted }">알림 현황</li>
        <li @click="changeTab(3)" class="text-dark" :class="{ 'is-active': selectCountList }">사육 두수 확인</li>
      </ul>
    </div>
    <!-- tab content -->
    <div class="adminContents">
      <CurrentList v-if="selectAdminCurrentList" @AlertedList="AlertedList" @CountList="CountList"></CurrentList>
      <Alerted v-if="selectAdminAlerted" @CurrentList="changeTab(1)"  @CountList="changeTab(3)"></Alerted>
      <CountList v-if="selectCountList" @CurrentList="changeTab(1)" @AlertedList="changeTab(2)"></CountList>
    </div>
    <app-footer class="footer_public"></app-footer>
    <BaseModal v-if="showModalError" @close="showModalError = false" :title="modalErrTitle" :message="modalErrMessage"></BaseModal>
  </div>
</template>

<script>
import NavbarAdmin from '../Admin/Layout/AdminNav'
import Footer from '../Admin/Layout/AdminFooter'
import AdminCurrentList from './AdminCurrentList'
import AdminAlerted from './AdminAlerted'
import CountList from './CountList'
import BaseModal from '../Modal/BaseModal'
import { mapActions,mapMutations } from 'vuex'
import socket from 'socket.io'
import io from 'socket.io-client'

export default {
  name: 'AdminTop',
  data() {
    return {
      selectAdminCurrentList: true,
      selectAdminAlerted: false,
      selectCountList: false,
      showModalError: false,
      modalErrTitle: '',
      modalErrMessage: '',
      indexTab: '',
      Waterdata:'',
      flag: false,
    }
  },
  components: {
    'app-header': NavbarAdmin,
    'CurrentList': AdminCurrentList,
    'CountList' : CountList,
    'Alerted': AdminAlerted,
    'app-footer': Footer,
    'BaseModal': BaseModal
  },
  methods: {
    changeTab: function(index) {
      this.indexTab = index
        if (index == 1) {
          this.selectAdminCurrentList = true
          this.selectAdminAlerted = false
          this.selectCountList = false
        } else if (index == 2) {
          this.selectAdminCurrentList = false
          this.selectAdminAlerted = true
          this.selectCountList = false
        } else if (index == 3) {
          this.selectAdminCurrentList = false
          this.selectAdminAlerted = false
          this.selectCountList = true
        }
    },
    CurrentList: function() {
      this.selectAdminCurrentList = true
      this.selectAdminAlerted = false
      this.selectCountList = false
    },
    AlertedList: function() {
      this.selectAdminCurrentList = false
      this.selectAdminAlerted = true
      this.selectCountList = false
    },
    CountList: function() {
      this.selectAdminCurrentList = false
      this.selectAdminAlerted = false
      this.selectCountList = true
    },
    ShowAlert: function(flag) {
      if(flag == true){
        this.showModalError = true
        this.modalErrTitle = '에러 발생'
        this.modalErrMessage = this.Waterdata
      } else {
        this.showModalError = false
        this.modalErrTitle = ''
        this.modalErrMessage = ''
      }
    }
  },
  created: function() {
    var socket = io.connect('http://localhost:3001')
    var userInput = 'asdsd'
    socket.emit('message', { message: userInput })

    var self = this
    socket.on('echo', function (data) {
      self.Waterdata = data['message']
      if(self.Waterdata !==''){
        console.log("messageIsNotNull",self.Waterdata)
        self.ShowAlert(true)
      } else {
        console.log("messageIsNull")
        self.ShowAlert(false)
      }
    })
  },
  updated() {
  },
  mounted: function(){
  }
}
</script>

<style lang="scss">
@import "../../assets/sass/Admin/AdminTop.scss";
body {
  padding: 0 !important;
  background-color: #ffffff;
}
footer {
  position: relative;
}
</style>
