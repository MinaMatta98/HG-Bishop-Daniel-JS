import gsap from 'gsap/all';
import { Howl } from 'howler';
import $ from 'jquery';

class Playlist {
  protected _firstLoad = true;

  protected _playlistContentContainer: JQuery<HTMLElement>;

  protected _playlistItems: PlayListItem[];

  protected _currentlyPlayingSection: JQuery<HTMLElement>;

  protected _player: Player;

  protected _downloadHtml = `<div class="menu-item"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.29,17.29,13,18.59V13a1,1,0,0,0-2,0v5.59l-1.29-1.3a1,1,0,0,0-1.42,1.42l3,3a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l3-3a1,1,0,0,0-1.42-1.42ZM18.42,6.22A7,7,0,0,0,5.06,8.11,4,4,0,0,0,6,16a1,1,0,0,0,0-2,2,2,0,0,1,0-4A1,1,0,0,0,7,9a5,5,0,0,1,9.73-1.61,1,1,0,0,0,.78.67,3,3,0,0,1,.24,5.84,1,1,0,1,0,.5,1.94,5,5,0,0,0,.17-9.62Z" fill="currentColor"></path></svg></div>`;

  protected _deleteHtml = `<div class="menu-item"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0294 5.02983L18.9688 3.96924L11.9991 10.9389L5.02944 3.96924L3.96875 5.02983L10.9385 11.9995L3.96875 18.9692L5.02944 20.0298L11.9991 13.0602L18.9688 20.0298L20.0294 18.9692L13.0597 11.9995L20.0294 5.02983Z" fill="currentColor"></path></svg></div>`;

  protected _animationTL: gsap.core.Timeline;

  /**
   * WARNING: REQUIRES UPDATE
   * @param id - [This should be the ID of the current sermon associated with the page]
   */
  constructor(id: string, player: Player) {
    this.initUI();
    this._animationTL = gsap.timeline();
    this._playlistItems = JSON.parse(localStorage.getItem('playlist')) || [];
    this._player = player;

    if (this._playlistItems.length > 0 && this._playlistItems.every((item) => item.id !== id)) {
      this._playlistItems.push(new PlayListItem(id));
    } else if (this._playlistItems.length === 0) {
      this._playlistItems.push(PlayListItem.testItem());
    }

    this.initalizeRender();
  }

  public getById = (id: string): PlayListItem => {
    return this._playlistItems.find((item) => item.id === id);
  };

  public initUI = (): void => {
    this._playlistContentContainer = $('.playlist-content');
    this._currentlyPlayingSection = $('.currently-playing');
    this._playlistContentContainer.children().remove();
  };

  public initalizeRender = (): void => {
    this.renderPlaylist();
    this.initializeSermonsHover();
  };

  public updateUI = (): void => {
    if (
      !this._playlistContentContainer.length ||
      !this._currentlyPlayingSection.length ||
      !this._playlistItems.length
    ) {
      this.initUI();
    }
    // Elements
    const currentId = this._player.getCurrentKey();
    const image = this._currentlyPlayingSection.find('.playlist-current-img');
    const text = this._currentlyPlayingSection.find('.player-sub-text');
    const title = text[0];
    const year = text[1];
    //const downloadButton = this._currentlyPlayingSection.find('.menu-item');
    //const currentlyPlayingText = this._currentlyPlayingSection.find('.currently-playing-text');

    // Values
    const currentItem = this._playlistItems.find((item) => item.id === currentId);
    const { imageSrc } = currentItem;
    const titleText = currentItem.title;
    const yearText = currentItem.year;

    gsap.set(image, { backgroundImage: `url(${imageSrc})` });
    $(title).text(`${titleText}`);
    $(year).text(`${yearText}`);

    //const downloadAnchor = $('<a/>', { href: currentItem.src, download: currentItem.title });
    //downloadAnchor.append(downloadButton);
    //currentlyPlayingText.append(downloadAnchor);
  };

  public appendToPlaylist = (item: PlayListItem): void => {
    this._playlistItems.push(item);
    localStorage.setItem('playlist', JSON.stringify(this._playlistItems));
    this.renderPlaylist();
  };

  public getAllSrc = (): { id: string; src: string }[] => {
    return this._playlistItems.map((item) => {
      return { id: item.id, src: item.src };
    });
  };

  public checkExists = (id: string): boolean => {
    return this._playlistItems.some((item) => item.id === id);
  };

  protected renderPlaylist = (): void => {
    const renderfn = () => {
      this._playlistItems.forEach((item) => {
        if (
          $('.playlist-item')
            .toArray()
            .some((compItem) => $(compItem).data('id') == item.id)
        )
          return;
        // Original Container
        const container = $('<div/>', {
          class: 'playlist-item',
          'data-id': item.id,
          'data-src': item.src,
          'data-title': item.title,
          'data-image': item.imageSrc,
          'data-year': item.year,
          'data-type': item.type,
        }).appendTo(this._playlistContentContainer);

        // Container Items
        $(() => {
          const playListMedia = $('<div/>', { class: 'playlist-media' });
          const playListMediaOptions = $('<div/>', { class: 'playlist-media-options' });
          const playListItemHeading = $('<h5/>', { class: 'playlist-item-heading' });
          const playListItemInfo = $('<div/>', { class: 'playlist-item-info' });
          const playListItemTheme = $('<div/>', { class: 'playlist-item-theme' });
          const playListItemName = $('<div/>', { class: 'playlist-item-name' });
          const playListItemType = playListItemTheme.clone();
          const playListItemYear = playListItemTheme.clone();
          const dot = $('<div/>', { class: 'dot' });
          const secondDot = dot.clone();
          const deleteButton = $(this._deleteHtml);
          const downloadButton = $(this._downloadHtml);
          const downloadAnchor = $('<a/>', { href: item.src, download: item.title });
          downloadAnchor.append(downloadButton);

          // Container Items Text
          playListItemHeading.text(item.title);
          playListItemTheme.text(item.theme);
          playListItemType.text(item.type);
          playListItemYear.text(item.year);
          //

          // Container Items Append
          playListItemName.append(playListItemHeading);
          playListItemInfo.append(
            playListItemTheme,
            dot,
            playListItemType,
            secondDot,
            playListItemYear
          );

          deleteButton.on('click', () => this._player.deleteTrack(item.id));
          playListMediaOptions.append(downloadAnchor, deleteButton);
          playListMedia.append(playListItemName, playListItemInfo);
          //

          // Container Append
          container.append(playListMedia);
          container.append(playListMediaOptions);
        });

        this._animationTL.from(container, { opacity: 0, translateX: '1em' });
      });
      this._firstLoad = false;
    };
    this._firstLoad ? setTimeout(() => renderfn(), 1500) : renderfn();
  };

  public deleteItem = async (id: string): Promise<void> => {
    this._playlistItems = this._playlistItems.filter((item) => item.id != id);
    localStorage.setItem('playlist', JSON.stringify(this._playlistItems));

    const container = this._playlistContentContainer
      .children()
      .toArray()
      .filter((item) => {
        return $(item).data('id') == id;
      })
      .shift();

    gsap.to(container, { opacity: 0, duration: 0.5, ease: 'none' });
    await gsap.to(container, { height: 0, duration: 1, ease: 'none' });

    if (container) container.remove();
  };

  public initializeSermonsHover = () => {
    const sermons = $('.sermon-container');
    sermons.each((_, sermon) => {
      const addBlock = $(sermon).find('.add-block');
      addBlock.on('click', () => {
        this._player.addTrack($(sermon).data('id'));
      });
    });
  };
}

class PlayListItem {
  public id: string;

  public src: string;

  public title: string;

  public imageSrc: string;

  public year: number;

  public theme: string;

  public type: 'Audio' | 'Video' | 'Pdf';

  constructor(id: string) {
    const item = $(`[data-id=${id}]`);
    this.id = item.data('id');
    this.id = this.id.toString();
    this.src = item.data('src');
    this.title = item.data('title');
    this.imageSrc = item.data('image');
    this.year = item.data('year');
    this.type = item.data('type');
    this.theme = item.data('theme');
  }

  public static testItem = (): PlayListItem => {
    return {
      id: '1',
      src: 'http://localhost:3000/generic-crowd-background-noise-31310.mp3',
      title: 'Generic Crowd Background Noise',
      imageSrc:
        'https://cdn.prod.website-files.com/667e528698a10bb61bdc997c/6714bb47f1e541413ad18136_Good%20Cry.png',
      year: 2020,
      theme: 'Sadness',
      type: 'Audio',
    };
  };
}

export class Player {
  protected _players: Map<string, Howl> = new Map();

  protected _playMain: JQuery<HTMLElement>;

  protected _playerProgress: JQuery<HTMLElement>;

  protected _progressContainer: JQuery<HTMLElement>;

  public playList: Playlist;

  protected _pauseMain: JQuery<HTMLElement>;

  protected _pauseMini: JQuery<HTMLElement>;

  protected _playMini: JQuery<HTMLElement>;

  protected _playerTime: JQuery<HTMLElement>;

  protected _playerControls: JQuery<HTMLElement>;

  protected _timers: number[] = [];

  constructor() {
    $(() => {
      this.initializeContainers();
      this.playList = new Playlist('1', this);
      this.playList.getAllSrc().forEach((source) => {
        this._players.set(
          source.id,
          new Howl({
            src: [source.src],
            html5: true,
            autoplay: false,
          })
        );
      });
      this.initUI();
    });
  }

  initializeContainers = (): void => {
    this._playMain = $('.main').children('.play-b');
    this._pauseMain = $('.main').children('.pause-b');
    const miniControls = $('.player-pause-play').children();
    this._playMini = $(miniControls[0]);
    this._pauseMini = $(miniControls[1]);
    this._playerTime = $('.time');
    this._progressContainer = $('.player-progress');
    this._playerProgress = $('.progress-made');
    this._playerControls = $('.player-controls');
  };

  public initUI = (): void => {
    this.syncPlayState();
    this.playList.updateUI();
    this.updateUI();
    this.initializeAllPlayers();
    this.initializeButtons();
    this.initProgressInteraction();
  };

  protected initializePlayer = (player: Howl): void => {
    player.on('play', () => {
      this.playList.updateUI();
      this.updateUI();
    });

    player.on('end', () => {
      this.next();
    });
  };

  public updateUI = (): void => {
    const heading = this._playerControls.find('.player-title');
    const subText = this._playerControls.find('.player-sub-text');
    const theme = subText[0];

    const currentId = this.getCurrentKey();
    const currentItem = this.playList.getById(currentId);

    heading.text(currentItem.title);
    $(theme).text(currentItem.theme);
    this.renderAudioDuration();
    this.updateElapsedTime();
  };

  protected initializeAllPlayers = (): void => {
    for (const value of this._players.values()) {
      this.initializePlayer(value);
    }
  };

  protected next = (): void => {
    const playnext = () => {
      const currentPlayer = this.getCurrentPlayer();
      currentPlayer.stop();
      currentPlayer.unload();
      this._players.delete(this.getCurrentKey());
      this._players.get(this.getCurrentKey()).play();
    };

    if (this._players.size === 1) {
      gsap.to(this._playerProgress, { width: '0%', duration: 2 });
      this.pauseState(true);
    } else if (this._players.size > 1) {
      this.playList.deleteItem(this.getCurrentKey());
      gsap.to(this._playerProgress, { width: '0%', duration: 2 });
      playnext();
    }
  };

  // This needs testing
  public addTrack = (id: string): void => {
    id = id.toString();
    if (this.playList.checkExists(id)) {
      return;
    }
    const playListItem = new PlayListItem(id);
    this.playList.appendToPlaylist(playListItem);
    const player = new Howl({
      src: playListItem.src,
      html5: true,
      autoplay: false,
    });
    this.initializePlayer(player);
    this._players.set(id, player);
  };

  public deleteTrack = (id: string): void => {
    this._players.get(id).unload();
    this._players.delete(id);
    this.playList.deleteItem(id);
  };

  public getCurrentKey = (): string => {
    return this._players.keys().next().value;
  };

  public getCurrentPlayer = (): Howl => {
    return this._players.get(this.getCurrentKey());
  };

  protected renderAudioDuration = (
    elapsed: number = <number>(<unknown>this.getCurrentPlayer().seek().toFixed(0)),
    time = <number>(<unknown>this.getCurrentPlayer().duration().toFixed(0))
  ): void => {
    let sanitizedTime: string;
    let sanitizedElapsed: string;

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = (time % 3600) % 60;

    const elapsedHours = Math.floor(elapsed / 3600);
    const elapsedMinutes = Math.floor((elapsed % 3600) / 60);
    const elapsedSeconds = (elapsed % 3600) % 60;

    if (time > 3600) {
      sanitizedTime = `${hours}:${minutes}:${seconds}`;
      sanitizedElapsed = `${elapsedHours}:${elapsedMinutes}:${elapsedSeconds}`;
    } else if (minutes > 60) {
      minutes < 10
        ? (sanitizedTime = `0${minutes}:${seconds}`)
        : (sanitizedTime = `${minutes}:${seconds}`);

      elapsedMinutes < 10
        ? (sanitizedElapsed = `0${elapsedMinutes}:${elapsedSeconds}`)
        : (sanitizedElapsed = `${elapsedMinutes}:${elapsedSeconds}`);
    } else {
      seconds < 10 ? (sanitizedTime = `00:0${seconds}`) : (sanitizedTime = `00:${seconds}`);
      elapsedSeconds < 10
        ? (sanitizedElapsed = `00:0${elapsedSeconds}`)
        : (sanitizedElapsed = `00:${elapsedSeconds}`);
    }

    if (elapsed) {
      this._playerTime.text(`${sanitizedElapsed}/${sanitizedTime}`);
    } else {
      this._playerTime.text(`${sanitizedTime}`);
    }
  };

  public updateElapsedTime = (elem: JQuery<HTMLElement> = this._playerProgress): void => {
    // Delete fn()
    for (const timer of this._timers) {
      clearInterval(timer);
    }

    const timerId = setInterval(() => {
      if (this.getCurrentPlayer().playing()) {
        this.renderAudioDuration();
        this.updateProgressBar(elem);
      }
    }, 1000);

    this.getCurrentPlayer().once('load', () => {
      this.renderAudioDuration();
      this.updateProgressBar(elem);
    });

    this._timers.push(timerId);
  };

  protected syncPlayState = (): void => {
    this.getCurrentPlayer().playing() ? this.playState(false) : this.pauseState(false);
  };

  protected initProgressInteraction = (): void => {
    [this._playerProgress, this._progressContainer].forEach((item) =>
      item.on('click', (e) => {
        const ratio =
          Math.abs(e.pageX - this._progressContainer.offset().left) /
          this._progressContainer.width();
        const currentPlayer = this.getCurrentPlayer();
        const seconds = Math.floor(currentPlayer.duration() * ratio);
        currentPlayer.seek(seconds);
        gsap.to(this._playerProgress, { width: `${(seconds / currentPlayer.duration()) * 100}%` });
        this.updateElapsedTime();
      })
    );
  };

  protected updateProgressBar = (elem: JQuery<HTMLElement>): void => {
    gsap.to(elem, {
      width: `${(this.getCurrentPlayer().seek() / this.getCurrentPlayer().duration()) * 100}%`,
      ease: 'none',
    });
  };

  protected pauseState = (pause: boolean): void => {
    this._pauseMain.parent().css('display', 'none');
    this._playMain.parent().css('display', 'block');
    this._playMini.css('display', 'block');
    this._pauseMini.css('display', 'none');
    if (pause && this.getCurrentPlayer()) this.getCurrentPlayer().pause();
  };

  protected playState = (play: boolean): void => {
    this._playMain.parent().css('display', 'none');
    this._pauseMain.parent().css('display', 'block');
    this._playMini.css('display', 'none');
    this._pauseMini.css('display', 'block');
    if (play && this.getCurrentPlayer()) this.getCurrentPlayer().play();
  };

  protected initializeButtons = (): void => {
    [this._playMain.parent().parent(), this._playMini.parent().parent()].forEach((item) =>
      item.on('click', () => {
        console.log(this.getCurrentPlayer().playing());
        this.getCurrentPlayer().playing() ? this.pauseState(true) : this.playState(true);
      })
    );
  };
}
