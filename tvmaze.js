/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
//found default image url on solution

const missingImg = 'http://tinyurl.com/missing-tv';

async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.
	// first we make our request
	let res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

	//need to map the data result
	let shows = res.data.map((result) => {
		let show = result.show;

		return {
			id: show.id,
			name: show.name,
			summary: show.summary,
			image: show.image ? show.image.medium : missingImg
		};
	});
	return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	//default code does not have a section for images
	//need to add button for the Get Episodes
	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-secondary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

	let episodes = res.data.map((episode) => ({
		id: episode.id,
		name: episode.name,
		season: episode.season,
		number: episode.number
	}));

	return episodes;
}

// If you wrote the functions in part 3 well, you should be able to this only by having to change the populateEpisodes function, but not other parts of your JavaScript — a nice reward for breaking your code thoughtfully into good functions

function populateEpisodes(episodes) {
	const $episodeList = $('#episode-list');

	$episodeList.empty();

	//make sure to use ` and not ' when writing the for of code so the ${} work properly

	for (let episode of episodes) {
		let $item = $(`<li> ${episode.name} (season ${episode.season}, episode ${episode.number}) </li>`);

		$episodeList.append($item);
	}

	$('#episode-area').show();
}
