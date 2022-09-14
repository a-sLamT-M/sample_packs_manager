<template>
  <div class="favorite">
    <loading
        class="loading"
        v-model:active="loading"
        loader="dots"
        :can-cancel="false"
      >
      </loading>
    <div
        class="scroll"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="pageLoading"
        infinite-scroll-distance="100">
        <div v-for="s in needToDisplay" :key="s">
          <SampleComponent :sample="s" 
          :onStarclickCallback="() => starSingleSample(s)"
          ></SampleComponent>
        </div>
    </div>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import { mapState, mapActions, mapGetters } from "vuex";
import SampleComponent from "@/components/data/SampleComponent.vue";
import '@/assets/css.css'
export default {
  name: 'Favorite',
  components: {SampleComponent, Loading},
  data() {
    return {
      pageLoading: false,
      pageCount: 20,
      vptr_l: 0,
      vptr_r: this.pageCount,
      allStared: [],
      needToDisplay: [],
    }
  },
  computed: {
    ...mapState([
      'loading',
    ]),
    ...mapGetters(['getStaredSamples']),
  },
  methods: {
    ...mapActions([
      'updateSamplesAction',
      'starSample'
    ]),
    loadMore: function () {
      if (this.allStared.length < this.pageCount) {
        return;
      }
      this.pageLoading = true;
      setTimeout(() => {
        this.vptr_l = this.vptr_r;
        this.vptr_r += this.pageCount;
        for (let i = this.vptr_l; i < this.vptr_r && i < this.searchedSamples.length; i++) {
          this.needToDisplay.push(this.allStared[i]);
        }
      }, 500);
      this.pageLoading = false;
    },
    debugEmptyFunc() {},
    async starSingleSample(sample) {
      console.log("s")
      await this.starSample(sample)
      this.allStared = this.getStaredSamples;
      this.needToDisplay.length = 0
      for (let i = this.vptr_l; i < this.vptr_r || i < this.allStared.length; i++) {
          this.needToDisplay.push(this.allStared[i]);
      }
    },
  },
  async mounted() {
    this.updateSamplesAction();
    this.allStared = this.getStaredSamples;
    
    for (let i = this.vptr_l; i < this.vptr_r || i < this.allStared.length; i++) {
          this.needToDisplay.push(this.allStared[i]);
    }
  }
}
</script>

<style scoped>
  .scroll {
    margin-top: 1rem;
  }
</style>