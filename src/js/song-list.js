{
    let view = {
        el: '#songList-container',
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data) {
            let { songs } = data
            let liList = songs.map((song) => $('<li></li>').text(song.name))
            let $el = $(this.el)
            $(this.el).html(this.template)
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })

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
                    return {id : song.id, ...song.attributes}
                });
                console.log(this.data.songs)
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData) => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}