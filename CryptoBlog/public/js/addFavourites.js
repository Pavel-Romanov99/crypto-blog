const button = document.querySelectorAll('cards button')[0];

console.log(button)

button.addEventListener('click', function(){

    const url = document.URL;
    const coinPath = url.split('/posts/')[1];
    const name = coinPath.split('-')[0].toLowerCase();
    const fullname = coinPath.split('-')[1].toLowerCase();

    if(button.id == 'favourites-button'){
        $.ajax({
            type: 'POST',
            url:`/favourite/${coinPath}`,
            date: coinPath,
            success: function(){
                console.log("made a request to " + url);
                console.log('added to favourites')
                button.id = 'remove-favourites-button'
                button.innerHTML = 'Remove from favourites'
                button.classList.add('btn-danger');
                button.classList.remove('btn-success');

                const group = document.querySelectorAll('.group')[0];

                const item = document.createElement('div');
                item.classList.add('link-items');
                item.id = `${coinPath}-fav-icon`;

                group.appendChild(item);

                const a = document.createElement('a');
                a.href = `/posts/${coinPath}`;

                item.appendChild(a);

                const img = document.createElement('img');
                img.src = `https://cryptologos.cc/logos/${fullname}-${name}-logo.svg?v=013`;

                a.appendChild(img);

                const label = document.createElement('label');
                label.innerHTML = name;

                item.appendChild(label);

                console.log(group)
            },
            error: function(){
                alert("error making the request")
            }
        });    
    }else {
        $.ajax({
            type: 'POST',
            url:`/favourite/delete/${coinPath}`,
            date: coinPath,
            success: function(){
                console.log("made a request to " + url);
                console.log("removed from favourites")
                button.id = 'favourites-button';
                button.innerHTML = 'Add to favourites'
                button.classList.remove('btn-danger');
                button.classList.add('btn-success');
                const icon = document.querySelector(`#${coinPath}-fav-icon`);
                icon.remove();
            },
            error: function(){
                alert("error making the request")
            }
        });
    }

})
