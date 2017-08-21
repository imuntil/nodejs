/**
 * Created by 斌 on 2017/4/26.
 */
$(function() {
  const editor = UE.getEditor('editor')
  let pro = $('#introduct-content').html()
  let decodePro = pro.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>').replace(/&quot;/ig, '"')

  setTimeout(function(){
    if (pro) {
      editor.setContent(decodePro)
    }
  }, 500)

  let IMGS = [], box = $('.ero-thumb-imgs-box'), files = [], ero = $('.a-file')
  let eroo = $('<input type="file" style="position: absolute;left: -100%;bottom: -100%" accept="image/*">')
  box.append(eroo)
  ero.change(function (e) {
    files = Array.from(e.target.files);
    if (!files || !files.length) return
    thumbImg(files)
  })

  function thumbImg (files) {
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader()
      reader.onload = function (e) {
        box.append(tpl(e.target.result, i))
        IMGS.push(e.target.result)
      }
      reader.readAsDataURL(files[i])
    }
  }

  function tpl (src, index) {
    return `<div class="col-xs-6 col-md-3 ero-thumb-img" data-img-ero-id="${index || -1}">
                <a href="javascript:;" class="ero-thumb-delete">&times;</a>
                <a href="#" class="thumbnail ero-thumb-modify">
                    <img src="${src}" alt="...">
                 </a>
             </div>`
  }


  box.on('click', '.ero-thumb-delete', function (e) {
    let img = $(this).parent(), id = img.attr('data-img-ero-id')
    IMGS.splice(id, 1)
    img.remove()
    files.splice(id, 1)
  })
  box.on('click', '.ero-thumb-modify', function (e) {
    let id = $(this).parent().attr('data-img-ero-id')
    eroo.data('__id', id).trigger('click')
  })
  eroo.change(function (e) {
    if (e.isTrusted) return
    let id = eroo.data('__id')
    console.log(id)
    let _file = e.target.files[0]

    let reader = new FileReader()
    reader.onload = function (e) {
      box.find(`.ero-thumb-img[data-img-ero-id='${id}']`).find('img').attr('src', e.target.result)
      IMGS.splice(id, 1, e.target.result)
    }
    try {
      reader.readAsDataURL(_file)
    } catch (e) {
      console.log(e)
    }
  })

  $('.post-form').on('submit', function (e) {
    e.preventDefault()
    let form = $(this)
    let formData = new FormData(form[0])
    files.forEach(item => {
      formData.append('pics', item)
    })
    $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: formData,
      processData: false,
      contentType: false,
      success (e) {
        console.log(e)
      }
    })
  })
































  let manualUploader = ''
  function fine() {
    manualUploader = new qq.FineUploader({
      element: document.getElementById('fine-uploader-manual-trigger'),
      template: 'qq-template-manual-trigger',
      request: {
        endpoint: '/test/uploads'
      },
      thumbnails: {
        placeholders: {
          waitingPath: '/source/placeholders/waiting-generic.png',
          notAvailablePath: '/source/placeholders/not_available-generic.png'
        }
      },
      autoUpload: false,
      debug: true,
      interceptSubmit: false,
    });

    qq(document.getElementById("trigger-upload")).attach("click", function() {
      manualUploader.uploadStoredFiles();
    });
  }

})