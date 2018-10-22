{
    let view = {
        el: '#songList-container',
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data) {
            let {
                songs
            } = data
            console.log(1111111)
            console.log(data)
            let liList = songs.map((song) => $('<li></li>').text(song.name).attr('data-id',song.id))
            let $el = $(this.el)
            $(this.el).html(this.template)
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
        },
        activeItem(el) {
            // console.log(el)
            $(el).addClass('active').siblings('li').removeClass('active')
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map(function (song) {
                    return {
                        id: song.id,
                        ...song.attributes
                    }
                });
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.getAllSongs()
            this.bindEventHub()
            this.bindEvent()
        },
        getAllSongs() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEventHub() {
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
        },
        bindEvent() {
            $(this.view.el).on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let songId = e.currentTarget.getAttribute('data-id')
                window.eventHub.emit('select',{id:songId})
            })
        }
    }
    controller.init(view, model)
}