<template>
  <div class="container" id="crop-avatar">
    <!-- Cropping modal -->
    <div class="modal" id="avatar-modal" aria-hidden="true" aria-labelledby="avatar-modal-label" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form class="avatar-form">
            <div class="modal-header">
              <button class="close" @click="cancel" type="button">&times;</button>
              <h4 class="modal-title" id="avatar-modal-label">上传头像</h4>
            </div>
            <div class="modal-body">
              <div class="avatar-body">

                <!-- Upload image and data -->
                <div class="avatar-upload">
                  <input class="avatar-src" name="avatar_src" type="hidden">
                  <input class="avatar-data" name="avatar_data" type="hidden">
                  <a href="javascript:;" class="btn btn-default file-btn">
                    选择图片
                    <input @change="change" class="avatar-input"
                           style="position: absolute;right: 0;top: 0;opacity: 0;width: 100%;height: 100%;"
                           id="avatarInput" name="avatar_file" type="file" accept="image/*">
                  </a>
                </div>

                <!-- Crop and preview -->
                <div class="row">
                  <div class="col-md-9">
                    <div class="avatar-wrapper"></div>
                  </div>
                  <!--<div class="col-md-3">-->
                  <!--<div class="avatar-preview preview-lg"></div>-->
                  <!--<div class="avatar-preview preview-md"></div>-->
                  <!--<div class="avatar-preview preview-sm"></div>-->
                  <!--</div>-->
                </div>

                <div class="row avatar-btns">
                  <div class="col-md-9">
                    <div class="btn-group">
                      <button class="btn btn-default"
                              @click="rotate(-90)"
                              type="button" title="Rotate -90 degrees">
                        <i class="material-icons">rotate_left</i>
                      </button>
                      <button class="btn btn-default"
                              @click="rotate(90)"
                              type="button"  title="Rotate 90 degrees">
                        <i class="material-icons">rotate_right</i>
                      </button>
                    </div>
                    <div class="btn-group keep-right">
                      <button class="btn btn-default" @click="scale(0.1)" type="button">
                        <i class="material-icons">zoom_in</i>
                      </button>
                      <button class="btn btn-default" @click="scale(-0.1)" type="button">
                        <i class="material-icons">zoom_out</i>
                      </button>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="btn-group keep-right keep-bottom">
                      <button class="btn btn-danger avatar-cancel"
                              @click="cancel" type="button">Cancel</button>
                      <button class="btn btn-success avatar-save"
                              @click="submit"
                              type="button">Save it</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="modal-footer">
              <button class="btn btn-default" data-dismiss="modal" type="button">Close</button>
            </div> -->
          </form>
        </div>
      </div>
    </div><!-- /.modal -->

    <!-- Loading state -->
    <div class="loading" aria-label="Loading" role="img" tabindex="-1"></div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import 'cropper'

  export default{
    props: {
      size: Number
    },
    data () {
      return {
        modalShow: false,
        url: undefined,
        active: false,
        avatarData: undefined,
        base64: undefined,

        $img: undefined,
        $avatarModal: undefined,
        $avatarWrapper: undefined
      }
    },
    methods: {
      click () {
        this.modalShow = true
      },
      change (e) {
        let files, file
        files = e.target.files
        if (files) {
          file = files[0]
        }
        console.log(file)
        this.url = URL.createObjectURL(file)
        this.startCropper()
      },
      submit () {
        if (!this.$img) return
        let option = {}
        if (this.size) {
          option = {width: this.size, height: this.size}
        }
        this.base64 = this.$img.cropper('getCroppedCanvas', option).toDataURL('image/jpeg')
        this.$emit('base64Data', this.base64)
      },
      cancel () {
        this.$emit('closeCropper')
      },
      scale (r) {
        if (!this.$img) return
        this.$img.cropper('zoom', r)
      },
      rotate (deg) {
        if (!this.$img) return
        this.$img.cropper('rotate', deg)
      },
      startCropper () {
        let self = this
        if (self.active) {
          self.$img.cropper('replace', self.url)
        } else {
          self.$img = $('<img src="' + self.url + '">')

          self.$avatarWrapper.empty().html(self.$img)
          self.$img.cropper({
            dragMode: 'move',
            zoomOnWheel: false,
            aspectRatio: 1,
            strict: false,
            crop (data) {
              self.avatarData = data
            }
          })
          self.active = true
        }
      }
    },
    mounted () {
      this.$avatarModal = $('#avatar-modal')
      this.$avatarWrapper = this.$avatarModal.find('.avatar-wrapper')
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  .material-icons {
    font-size:1.5rem;
    display: block;
    padding: 4px 0;
  }
</style>
<style lang="scss" type="text/scss" scoped>
  @import "../../node_modules/cropper/dist/cropper.min.css";

  .container {
    margin-right:  auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  @media (min-width: 768px) {
    .container {
      width: 750px;
    }
  }
  @media (min-width: 992px) {
    .container {
      width: 970px;
    }
  }
  @media (min-width: 1200px) {
    .container {
      width: 1170px;
    }
  }
  .container-fluid {
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  .row {
    margin-left: -15px;
    margin-right: -15px;
  }
  .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
  }
  @media (min-width: 992px) {
    .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
      float: left;
    }
    .col-md-12 {
      width: 100%;
    }
    .col-md-11 {
      width: 91.66666667%;
    }
    .col-md-10 {
      width: 83.33333333%;
    }
    .col-md-9 {
      width: 75%;
    }
    .col-md-8 {
      width: 66.66666667%;
    }
    .col-md-7 {
      width: 58.33333333%;
    }
    .col-md-6 {
      width: 50%;
    }
    .col-md-5 {
      width: 41.66666667%;
    }
    .col-md-4 {
      width: 33.33333333%;
    }
    .col-md-3 {
      width: 25%;
    }
    .col-md-2 {
      width: 16.66666667%;
    }
    .col-md-1 {
      width: 8.33333333%;
    }
  }
  .btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid transparent;
    white-space: nowrap;
    padding: 6px 12px;
    font-size: 16px;
    line-height: 1.42857143;
    border-radius: 4px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .btn:focus,
  .btn:active:focus,
  .btn.active:focus,
  .btn.focus,
  .btn:active.focus,
  .btn.active.focus {
    outline: 5px auto -webkit-focus-ring-color;
    outline-offset: -2px;
  }
  .btn:hover,
  .btn:focus,
  .btn.focus {
    color: #333333;
    text-decoration: none;
  }
  .btn:active,
  .btn.active {
    outline: 0;
    background-image: none;
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }
  .btn.disabled,
  .btn[disabled],
  fieldset[disabled] .btn {
    cursor: not-allowed;
    opacity: 0.65;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  a.btn.disabled,
  fieldset[disabled] a.btn {
    pointer-events: none;
  }
  .btn-default {
    color: #333333;
    background-color: #ffffff;
    border-color: #cccccc;
  }
  .btn-default:focus,
  .btn-default.focus {
    color: #333333;
    background-color: #e6e6e6;
    border-color: #8c8c8c;
  }
  .btn-default:hover {
    color: #333333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }
  .btn-default:active,
  .btn-default.active,
  .open > .dropdown-toggle.btn-default {
    color: #333333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }
  .btn-default:active:hover,
  .btn-default.active:hover,
  .open > .dropdown-toggle.btn-default:hover,
  .btn-default:active:focus,
  .btn-default.active:focus,
  .open > .dropdown-toggle.btn-default:focus,
  .btn-default:active.focus,
  .btn-default.active.focus,
  .open > .dropdown-toggle.btn-default.focus {
    color: #333333;
    background-color: #d4d4d4;
    border-color: #8c8c8c;
  }
  .btn-default:active,
  .btn-default.active,
  .open > .dropdown-toggle.btn-default {
    background-image: none;
  }
  .btn-default.disabled:hover,
  .btn-default[disabled]:hover,
  fieldset[disabled] .btn-default:hover,
  .btn-default.disabled:focus,
  .btn-default[disabled]:focus,
  fieldset[disabled] .btn-default:focus,
  .btn-default.disabled.focus,
  .btn-default[disabled].focus,
  fieldset[disabled] .btn-default.focus {
    background-color: #ffffff;
    border-color: #cccccc;
  }
  .btn-default .badge {
    color: #ffffff;
    background-color: #333333;
  }
  .btn-primary {
    color: #ffffff;
    background-color: #337ab7;
    border-color: #2e6da4;
  }
  .btn-primary:focus,
  .btn-primary.focus {
    color: #ffffff;
    background-color: #286090;
    border-color: #122b40;
  }
  .btn-primary:hover {
    color: #ffffff;
    background-color: #286090;
    border-color: #204d74;
  }
  .btn-primary:active,
  .btn-primary.active,
  .open > .dropdown-toggle.btn-primary {
    color: #ffffff;
    background-color: #286090;
    border-color: #204d74;
  }
  .btn-primary:active:hover,
  .btn-primary.active:hover,
  .open > .dropdown-toggle.btn-primary:hover,
  .btn-primary:active:focus,
  .btn-primary.active:focus,
  .open > .dropdown-toggle.btn-primary:focus,
  .btn-primary:active.focus,
  .btn-primary.active.focus,
  .open > .dropdown-toggle.btn-primary.focus {
    color: #ffffff;
    background-color: #204d74;
    border-color: #122b40;
  }
  .btn-primary:active,
  .btn-primary.active,
  .open > .dropdown-toggle.btn-primary {
    background-image: none;
  }
  .btn-primary.disabled:hover,
  .btn-primary[disabled]:hover,
  fieldset[disabled] .btn-primary:hover,
  .btn-primary.disabled:focus,
  .btn-primary[disabled]:focus,
  fieldset[disabled] .btn-primary:focus,
  .btn-primary.disabled.focus,
  .btn-primary[disabled].focus,
  fieldset[disabled] .btn-primary.focus {
    background-color: #337ab7;
    border-color: #2e6da4;
  }
  .btn-primary .badge {
    color: #337ab7;
    background-color: #ffffff;
  }
  .btn-success {
    color: #ffffff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .btn-success:focus,
  .btn-success.focus {
    color: #ffffff;
    background-color: #449d44;
    border-color: #255625;
  }
  .btn-success:hover {
    color: #ffffff;
    background-color: #449d44;
    border-color: #398439;
  }
  .btn-success:active,
  .btn-success.active,
  .open > .dropdown-toggle.btn-success {
    color: #ffffff;
    background-color: #449d44;
    border-color: #398439;
  }
  .btn-success:active:hover,
  .btn-success.active:hover,
  .open > .dropdown-toggle.btn-success:hover,
  .btn-success:active:focus,
  .btn-success.active:focus,
  .open > .dropdown-toggle.btn-success:focus,
  .btn-success:active.focus,
  .btn-success.active.focus,
  .open > .dropdown-toggle.btn-success.focus {
    color: #ffffff;
    background-color: #398439;
    border-color: #255625;
  }
  .btn-success:active,
  .btn-success.active,
  .open > .dropdown-toggle.btn-success {
    background-image: none;
  }
  .btn-success.disabled:hover,
  .btn-success[disabled]:hover,
  fieldset[disabled] .btn-success:hover,
  .btn-success.disabled:focus,
  .btn-success[disabled]:focus,
  fieldset[disabled] .btn-success:focus,
  .btn-success.disabled.focus,
  .btn-success[disabled].focus,
  fieldset[disabled] .btn-success.focus {
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .btn-success .badge {
    color: #5cb85c;
    background-color: #ffffff;
  }
  .btn-info {
    color: #ffffff;
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .btn-info:focus,
  .btn-info.focus {
    color: #ffffff;
    background-color: #31b0d5;
    border-color: #1b6d85;
  }
  .btn-info:hover {
    color: #ffffff;
    background-color: #31b0d5;
    border-color: #269abc;
  }
  .btn-info:active,
  .btn-info.active,
  .open > .dropdown-toggle.btn-info {
    color: #ffffff;
    background-color: #31b0d5;
    border-color: #269abc;
  }
  .btn-info:active:hover,
  .btn-info.active:hover,
  .open > .dropdown-toggle.btn-info:hover,
  .btn-info:active:focus,
  .btn-info.active:focus,
  .open > .dropdown-toggle.btn-info:focus,
  .btn-info:active.focus,
  .btn-info.active.focus,
  .open > .dropdown-toggle.btn-info.focus {
    color: #ffffff;
    background-color: #269abc;
    border-color: #1b6d85;
  }
  .btn-info:active,
  .btn-info.active,
  .open > .dropdown-toggle.btn-info {
    background-image: none;
  }
  .btn-info.disabled:hover,
  .btn-info[disabled]:hover,
  fieldset[disabled] .btn-info:hover,
  .btn-info.disabled:focus,
  .btn-info[disabled]:focus,
  fieldset[disabled] .btn-info:focus,
  .btn-info.disabled.focus,
  .btn-info[disabled].focus,
  fieldset[disabled] .btn-info.focus {
    background-color: #5bc0de;
    border-color: #46b8da;
  }
  .btn-info .badge {
    color: #5bc0de;
    background-color: #ffffff;
  }
  .btn-warning {
    color: #ffffff;
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .btn-warning:focus,
  .btn-warning.focus {
    color: #ffffff;
    background-color: #ec971f;
    border-color: #985f0d;
  }
  .btn-warning:hover {
    color: #ffffff;
    background-color: #ec971f;
    border-color: #d58512;
  }
  .btn-warning:active,
  .btn-warning.active,
  .open > .dropdown-toggle.btn-warning {
    color: #ffffff;
    background-color: #ec971f;
    border-color: #d58512;
  }
  .btn-warning:active:hover,
  .btn-warning.active:hover,
  .open > .dropdown-toggle.btn-warning:hover,
  .btn-warning:active:focus,
  .btn-warning.active:focus,
  .open > .dropdown-toggle.btn-warning:focus,
  .btn-warning:active.focus,
  .btn-warning.active.focus,
  .open > .dropdown-toggle.btn-warning.focus {
    color: #ffffff;
    background-color: #d58512;
    border-color: #985f0d;
  }
  .btn-warning:active,
  .btn-warning.active,
  .open > .dropdown-toggle.btn-warning {
    background-image: none;
  }
  .btn-warning.disabled:hover,
  .btn-warning[disabled]:hover,
  fieldset[disabled] .btn-warning:hover,
  .btn-warning.disabled:focus,
  .btn-warning[disabled]:focus,
  fieldset[disabled] .btn-warning:focus,
  .btn-warning.disabled.focus,
  .btn-warning[disabled].focus,
  fieldset[disabled] .btn-warning.focus {
    background-color: #f0ad4e;
    border-color: #eea236;
  }
  .btn-warning .badge {
    color: #f0ad4e;
    background-color: #ffffff;
  }
  .btn-danger {
    color: #ffffff;
    background-color: #d9534f;
    border-color: #d43f3a;
  }
  .btn-danger:focus,
  .btn-danger.focus {
    color: #ffffff;
    background-color: #c9302c;
    border-color: #761c19;
  }
  .btn-danger:hover {
    color: #ffffff;
    background-color: #c9302c;
    border-color: #ac2925;
  }
  .btn-danger:active,
  .btn-danger.active,
  .open > .dropdown-toggle.btn-danger {
    color: #ffffff;
    background-color: #c9302c;
    border-color: #ac2925;
  }
  .btn-danger:active:hover,
  .btn-danger.active:hover,
  .open > .dropdown-toggle.btn-danger:hover,
  .btn-danger:active:focus,
  .btn-danger.active:focus,
  .open > .dropdown-toggle.btn-danger:focus,
  .btn-danger:active.focus,
  .btn-danger.active.focus,
  .open > .dropdown-toggle.btn-danger.focus {
    color: #ffffff;
    background-color: #ac2925;
    border-color: #761c19;
  }
  .btn-danger:active,
  .btn-danger.active,
  .open > .dropdown-toggle.btn-danger {
    background-image: none;
  }
  .btn-danger.disabled:hover,
  .btn-danger[disabled]:hover,
  fieldset[disabled] .btn-danger:hover,
  .btn-danger.disabled:focus,
  .btn-danger[disabled]:focus,
  fieldset[disabled] .btn-danger:focus,
  .btn-danger.disabled.focus,
  .btn-danger[disabled].focus,
  fieldset[disabled] .btn-danger.focus {
    background-color: #d9534f;
    border-color: #d43f3a;
  }
  .btn-danger .badge {
    color: #d9534f;
    background-color: #ffffff;
  }
  .btn-link {
    color: #337ab7;
    font-weight: normal;
    border-radius: 0;
  }
  .btn-link,
  .btn-link:active,
  .btn-link.active,
  .btn-link[disabled],
  fieldset[disabled] .btn-link {
    background-color: transparent;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .btn-link,
  .btn-link:hover,
  .btn-link:focus,
  .btn-link:active {
    border-color: transparent;
  }
  .btn-link:hover,
  .btn-link:focus {
    color: #23527c;
    text-decoration: underline;
    background-color: transparent;
  }
  .btn-link[disabled]:hover,
  fieldset[disabled] .btn-link:hover,
  .btn-link[disabled]:focus,
  fieldset[disabled] .btn-link:focus {
    color: #777777;
    text-decoration: none;
  }
  .btn-lg,
  .btn-group-lg > .btn {
    padding: 10px 16px;
    font-size: 20px;
    line-height: 1.3333333;
    border-radius: 6px;
  }
  .btn-sm,
  .btn-group-sm > .btn {
    padding: 5px 10px;
    font-size: 14px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .btn-xs,
  .btn-group-xs > .btn {
    padding: 1px 5px;
    font-size: 14px;
    line-height: 1.5;
    border-radius: 3px;
  }
  .btn-block {
    display: block;
    width: 100%;
  }
  .btn-block + .btn-block {
    margin-top: 5px;
  }
  input[type="submit"].btn-block,
  input[type="reset"].btn-block,
  input[type="button"].btn-block {
    width: 100%;
  }
  .btn-group,
  .btn-group-vertical {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .btn-group > .btn,
  .btn-group-vertical > .btn {
    position: relative;
    float: left;
  }
  .btn-group > .btn:hover,
  .btn-group-vertical > .btn:hover,
  .btn-group > .btn:focus,
  .btn-group-vertical > .btn:focus,
  .btn-group > .btn:active,
  .btn-group-vertical > .btn:active,
  .btn-group > .btn.active,
  .btn-group-vertical > .btn.active {
    z-index: 2;
  }
  .btn-group .btn + .btn,
  .btn-group .btn + .btn-group,
  .btn-group .btn-group + .btn,
  .btn-group .btn-group + .btn-group {
    margin-left: -1px;
  }
  .btn-toolbar {
    margin-left: -5px;
  }
  .btn-toolbar .btn,
  .btn-toolbar .btn-group,
  .btn-toolbar .input-group {
    float: left;
  }
  .btn-toolbar > .btn,
  .btn-toolbar > .btn-group,
  .btn-toolbar > .input-group {
    margin-left: 5px;
  }
  .btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {
    border-radius: 0;
  }
  .btn-group > .btn:first-child {
    margin-left: 0;
  }
  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .btn-group > .btn:last-child:not(:first-child),
  .btn-group > .dropdown-toggle:not(:first-child) {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .btn-group > .btn-group {
    float: left;
  }
  .btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {
    border-radius: 0;
  }
  .btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,
  .btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .btn-group .dropdown-toggle:active,
  .btn-group.open .dropdown-toggle {
    outline: 0;
  }
  .btn-group > .btn + .dropdown-toggle {
    padding-left: 8px;
    padding-right: 8px;
  }
  .btn-group > .btn-lg + .dropdown-toggle {
    padding-left: 12px;
    padding-right: 12px;
  }
  .btn-group.open .dropdown-toggle {
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }
  .btn-group.open .dropdown-toggle.btn-link {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .btn .caret {
    margin-left: 0;
  }
  .btn-lg .caret {
    border-width: 5px 5px 0;
    border-bottom-width: 0;
  }
  .dropup .btn-lg .caret {
    border-width: 0 5px 5px;
  }
  .btn-group-vertical > .btn,
  .btn-group-vertical > .btn-group,
  .btn-group-vertical > .btn-group > .btn {
    display: block;
    float: none;
    width: 100%;
    max-width: 100%;
  }
  .btn-group-vertical > .btn-group > .btn {
    float: none;
  }
  .btn-group-vertical > .btn + .btn,
  .btn-group-vertical > .btn + .btn-group,
  .btn-group-vertical > .btn-group + .btn,
  .btn-group-vertical > .btn-group + .btn-group {
    margin-top: -1px;
    margin-left: 0;
  }
  .btn-group-vertical > .btn:not(:first-child):not(:last-child) {
    border-radius: 0;
  }
  .btn-group-vertical > .btn:first-child:not(:last-child) {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .btn-group-vertical > .btn:last-child:not(:first-child) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {
    border-radius: 0;
  }
  .btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,
  .btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
  .btn-group-justified {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-collapse: separate;
  }
  .btn-group-justified > .btn,
  .btn-group-justified > .btn-group {
    float: none;
    display: table-cell;
    width: 1%;
  }
  .btn-group-justified > .btn-group .btn {
    width: 100%;
  }
  .btn-group-justified > .btn-group .dropdown-menu {
    left: auto;
  }
  [data-toggle="buttons"] > .btn input[type="radio"],
  [data-toggle="buttons"] > .btn-group > .btn input[type="radio"],
  [data-toggle="buttons"] > .btn input[type="checkbox"],
  [data-toggle="buttons"] > .btn-group > .btn input[type="checkbox"] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
  }
  .close {
    float: right;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
    color: #000000;
    text-shadow: 0 1px 0 #ffffff;
    opacity: 0.2;
    filter: alpha(opacity=20);
  }
  .close:hover,
  .close:focus {
    color: #000000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.5;
    filter: alpha(opacity=50);
  }
  button.close {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
  }
  .modal-open {
    overflow: hidden;
  }
  .modal {
    display: none;
    overflow: hidden;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    -webkit-overflow-scrolling: touch;
    outline: 0;
  }
  .modal.fade .modal-dialog {
    -webkit-transform: translate(0, -25%);
    -ms-transform: translate(0, -25%);
    -o-transform: translate(0, -25%);
    transform: translate(0, -25%);
    -webkit-transition: -webkit-transform 0.3s ease-out;
    -o-transition: -o-transform 0.3s ease-out;
    transition: transform 0.3s ease-out;
  }
  .modal.in .modal-dialog {
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0);
  }
  .modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto;
  }
  .modal-dialog {
    position: relative;
    width: auto;
    margin: 10px;
  }
  .modal-content {
    position: relative;
    background-color: #ffffff;
    border: 1px solid #999999;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    outline: 0;
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    background-color: #000000;
  }
  .modal-backdrop.fade {
    opacity: 0;
    filter: alpha(opacity=0);
  }
  .modal-backdrop.in {
    opacity: 0.5;
    filter: alpha(opacity=50);
  }
  .modal-header {
    padding: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .modal-header .close {
    margin-top: -2px;
  }
  .modal-title {
    margin: 0;
    line-height: 1.42857143;
  }
  .modal-body {
    position: relative;
    padding: 15px;
  }
  .modal-footer {
    padding: 15px;
    text-align: right;
    border-top: 1px solid #e5e5e5;
  }
  .modal-footer .btn + .btn {
    margin-left: 5px;
    margin-bottom: 0;
  }
  .modal-footer .btn-group .btn + .btn {
    margin-left: -1px;
  }
  .modal-footer .btn-block + .btn-block {
    margin-left: 0;
  }
  .modal-scrollbar-measure {
    position: absolute;
    top: -9999px;
    width: 50px;
    height: 50px;
    overflow: scroll;
  }
  @media (min-width: 768px) {
    .modal-dialog {
      width: 600px;
      margin: 30px auto;
    }
    .modal-content {
      -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    }
    .modal-sm {
      width: 300px;
    }
  }
  @media (min-width: 992px) {
    .modal-lg {
      width: 900px;
    }
  }
  .tooltip {
    position: absolute;
    z-index: 1070;
    display: block;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-style: normal;
    font-weight: normal;
    letter-spacing: normal;
    line-break: auto;
    line-height: 1.42857143;
    text-align: left;
    text-align: start;
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    white-space: normal;
    word-break: normal;
    word-spacing: normal;
    word-wrap: normal;
    font-size: 14px;
    opacity: 0;
    filter: alpha(opacity=0);
  }
  .tooltip.in {
    opacity: 0.9;
    filter: alpha(opacity=90);
  }
  .tooltip.top {
    margin-top: -3px;
    padding: 5px 0;
  }
  .tooltip.right {
    margin-left: 3px;
    padding: 0 5px;
  }
  .tooltip.bottom {
    margin-top: 3px;
    padding: 5px 0;
  }
  .tooltip.left {
    margin-left: -3px;
    padding: 0 5px;
  }
  .tooltip-inner {
    max-width: 200px;
    padding: 3px 8px;
    color: #ffffff;
    text-align: center;
    background-color: #000000;
    border-radius: 4px;
  }
  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
  }
  .tooltip.top .tooltip-arrow {
    bottom: 0;
    left: 50%;
    margin-left: -5px;
    border-width: 5px 5px 0;
    border-top-color: #000000;
  }
  .tooltip.top-left .tooltip-arrow {
    bottom: 0;
    right: 5px;
    margin-bottom: -5px;
    border-width: 5px 5px 0;
    border-top-color: #000000;
  }
  .tooltip.top-right .tooltip-arrow {
    bottom: 0;
    left: 5px;
    margin-bottom: -5px;
    border-width: 5px 5px 0;
    border-top-color: #000000;
  }
  .tooltip.right .tooltip-arrow {
    top: 50%;
    left: 0;
    margin-top: -5px;
    border-width: 5px 5px 5px 0;
    border-right-color: #000000;
  }
  .tooltip.left .tooltip-arrow {
    top: 50%;
    right: 0;
    margin-top: -5px;
    border-width: 5px 0 5px 5px;
    border-left-color: #000000;
  }
  .tooltip.bottom .tooltip-arrow {
    top: 0;
    left: 50%;
    margin-left: -5px;
    border-width: 0 5px 5px;
    border-bottom-color: #000000;
  }
  .tooltip.bottom-left .tooltip-arrow {
    top: 0;
    right: 5px;
    margin-top: -5px;
    border-width: 0 5px 5px;
    border-bottom-color: #000000;
  }
  .tooltip.bottom-right .tooltip-arrow {
    top: 0;
    left: 5px;
    margin-top: -5px;
    border-width: 0 5px 5px;
    border-bottom-color: #000000;
  }
  .clearfix:before,
  .clearfix:after,
  .container:before,
  .container:after,
  .container-fluid:before,
  .container-fluid:after,
  .row:before,
  .row:after,
  .btn-toolbar:before,
  .btn-toolbar:after,
  .btn-group-vertical > .btn-group:before,
  .btn-group-vertical > .btn-group:after,
  .modal-header:before,
  .modal-header:after,
  .modal-footer:before,
  .modal-footer:after {
    content: " ";
    display: table;
  }
  .clearfix:after,
  .container:after,
  .container-fluid:after,
  .row:after,
  .btn-toolbar:after,
  .btn-group-vertical > .btn-group:after,
  .modal-header:after,
  .modal-footer:after {
    clear: both;
  }
  .center-block {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #avatar-modal {
    display: block;
    background: rgba(0, 0, 0, 0.4);
    overflow: scroll;
  }
  .avatar-view {
    display: block;
    margin: 15% auto 5%;
    height: 220px;
    width: 220px;
    border: 3px solid #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0,0,0,.15);
    cursor: pointer;
    overflow: hidden;
  }

  .avatar-view img {
    width: 100%;
  }

  .avatar-body {
    padding-right: 15px;
    padding-left: 15px;
  }

  .avatar-upload {
    overflow: hidden;
  }

  .avatar-upload label {
    display: block;
    float: left;
    clear: left;
    width: 100px;
  }

  .avatar-upload input {
    display: block;
    /*margin-left: 110px;*/
  }

  .avater-alert {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .avatar-wrapper {
    height: 300px;
    width: 100%;
    margin-top: 15px;
    box-shadow: inset 0 0 5px rgba(0,0,0,.25);
    background-color: #fcfcfc;
    overflow: hidden;
  }

  .avatar-wrapper img {
    display: block;
    height: auto;
    max-width: 100%;
  }

  .avatar-preview {
    float: left;
    margin-top: 15px;
    margin-right: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
  }

  .avatar-preview:hover {
    border-color: #ccf;
    box-shadow: 0 0 5px rgba(0,0,0,.15);
  }

  .avatar-preview img {
    width: 100%;
  }

  .preview-lg {
    height: 184px;
    width: 184px;
    margin-top: 15px;
  }

  .preview-md {
    height: 100px;
    width: 100px;
  }

  .preview-sm {
    height: 50px;
    width: 50px;
  }

  @media (min-width: 992px) {
    .avatar-preview {
      float: none;
    }
  }
  .container {
    width:100%;
    height:100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    left:0;
    top:0;
    animation-duration: .5s;
    z-index: 100;
  }

  .avatar-btns {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .avatar-btns .btn-group {
    margin-right: 5px;
  }

  .loading {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /*background: #fff url("../img/loading.gif") no-repeat center center;*/
    opacity: .75;
    filter: alpha(opacity=75);
    z-index: 20140628;
  }
  .file-btn {
    position: relative;
  }
  .docs-tooltip {
    display: block;
    .fa {
      display: inline-block;
      font-size: inherit;
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
    }
    .opposite {
      transform: scaleX(-1)
    }
  }
  .btn-group.keep-right {
    float: right;
  }
  .btn-group.keep-bottom {
    margin-top:10px;
  }

</style>
