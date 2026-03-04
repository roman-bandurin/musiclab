export function MainPageLayout (
  { onLogout }: { onLogout?: () => void } = {},
) {
  return (
    <div className="pages">
      <input type="checkbox" id="panel-toggle" className="panel-toggle" aria-label="Переключить панель навигации" />
      <nav className="panel">
        <label className="radio-option">
          <input type="radio" name="tab" id="tab-3" defaultChecked />
          <span>3</span>
        </label>
        <label className="radio-option">
          <input type="radio" name="tab" id="tab-4" />
          <span>4</span>
        </label>
        <label className="radio-option">
          <input type="radio" name="tab" id="tab-5" />
          <span>5</span>
        </label>
        <label className="radio-option">
          <input type="radio" name="tab" id="tab-6" />
          <span>6</span>
        </label>
        <label className="radio-option">
          <input type="radio" name="tab" id="tab-7" />
          <span>7</span>
        </label>
        <label className="radio-option radio-option--checkbox">
          <input type="checkbox" id="tab-8" aria-label="Контент загружен" />
          <span>8</span>
        </label>
        <label className="radio-option radio-option--checkbox">
          <input type="checkbox" id="tab-9" aria-label="Показать плеер" />
          <span>9</span>
        </label>
        <label className="radio-option">
          <input type="radio" name="tab" id="tab-10" aria-label="404 страница" />
          <span>10</span>
        </label>
      </nav>
      <div className="page page_app app-layout">
      <aside className="sidebar">
        <label htmlFor="tab-3" className="sidebar__logo-wrap" aria-label="На главную">
          <img src="#" className="sidebar__logo" alt="" />
        </label>
        <div className="sidebar__menu-wrap">
          <input type="checkbox" id="sidebar-menu" className="sidebar__menu-toggle visually-hidden" aria-label="Открыть меню" aria-controls="sidebar-nav" />
          <label htmlFor="sidebar-menu" className="sidebar__menu-btn" aria-label="Меню">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" aria-hidden="true" className="sidebar__menu-icon" viewBox="0 0 20 11"><path stroke="currentColor" d="M20 .5H0m20 5H0m20 5H0" /></svg>
          </label>
          <nav id="sidebar-nav" className="sidebar__nav" aria-label="Основная навигация">
          <ul className="sidebar__nav-list">
            <li className="sidebar__nav-item">
              <label htmlFor="tab-3" className="sidebar__nav-link-wrap"><a href="#" className="sidebar__nav-link" title="Главное">Главное</a></label>
            </li>
            <li className="sidebar__nav-item">
              <label htmlFor="tab-7" className="sidebar__nav-link-wrap"><a href="#" className="sidebar__nav-link" title="Мои треки">Мои треки</a></label>
            </li>
            <li className="sidebar__nav-item">
              <button
                type="button"
                className="sidebar__nav-link-wrap"
                onClick={onLogout}
                style={{
                  background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left',
                }}
              >
                <span className="sidebar__nav-link sidebar__nav-link--logout" title="Выйти из аккаунта">Выйти</span>
              </button>
            </li>
            <li className="sidebar__nav-item sidebar__nav-item--theme">
              <input type="checkbox" id="theme-toggle" className="sidebar__theme-toggle visually-hidden" aria-label="Переключить тему" />
              <label htmlFor="theme-toggle" className="sidebar__theme-btn sidebar__theme-btn--dark" aria-label="Переключить на светлую тему">
                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" fill="none" aria-hidden="true" className="sidebar__theme-icon" viewBox="0 0 39 39">
<path fill="currentColor" d="M19.2 27.4a8.2 8.2 0 0 1-.8-16.4q.5 0 .7.4 0 .4-.2.7a5 5 0 1 0 7.4 6.9.6.6 0 0 1 1.1.4 8 8 0 0 1-8.2 8M17 12.6a7 7 0 1 0 9 8.4q-1.5 1-3.5 1.1a6.3 6.3 0 0 1-5.5-9.5" />
<circle cx="19.5" cy="19.5" r="19" stroke="currentColor" />
                </svg>
              </label>
              <label htmlFor="theme-toggle" className="sidebar__theme-btn sidebar__theme-btn--light" aria-label="Переключить на тёмную тему">
                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" fill="none" aria-hidden="true" className="sidebar__theme-icon" viewBox="0 0 39 39">
<path fill="currentColor" d="M19.8 25.6a6.2 6.2 0 1 1 0-12.4 6.2 6.2 0 0 1 0 12.4m0-11.2a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0-3.6-.6-.6V7.6a.6.6 0 0 1 1.3 0v2.6q0 .6-.7.6M26 14a.6.6 0 0 1-.4-1l2.2-2.3a.6.6 0 0 1 .9.9l-2.2 2.2zm-13.4 0-.4-.2-2.2-2.2a.6.6 0 0 1 .9-.9L13 13a.6.6 0 0 1-.5 1.1m6.8 17.6-.6-.6v-2.6a.6.6 0 1 1 1.3 0v2.6q0 .6-.7.6M11 28.2a.6.6 0 0 1-.5-1l2.2-2.3a.6.6 0 1 1 .9 1L11.4 28q-.2.2-.5.2m17.8 0-.4-.2-2.2-2.2a.6.6 0 1 1 .9-.9l2.2 2.3a.6.6 0 0 1-.5 1M10.4 20H7.6a.6.6 0 1 1 0-1.2h2.8a.6.6 0 0 1 0 1.2m21.2 0h-3.4a.6.6 0 1 1 0-1.2h3.4a.6.6 0 0 1 0 1.2" />
<circle cx="19.5" cy="19.5" r="19" stroke="currentColor" />
                </svg>
              </label>
            </li>
          </ul>
          </nav>
        </div>
      </aside>
      <main className="main">
        <header className="main__header">
          <form className="main__search-form" role="search">
            <input type="search" aria-label="Поиск по трекам" placeholder="Поиск" className="main__search" />
          </form>
          <button
            type="button"
            className="main__logout-wrap"
            aria-label="Выйти и перейти на страницу входа"
            onClick={onLogout}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            }}
          >
            <span className="main__logout-btn" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" aria-hidden="true" className="main__logout-icon" viewBox="0 0 40 40">
<rect width="10.93" height="16.81" x="13.53" y="11.59" stroke="currentColor" strokeDasharray="35.2 8.56" strokeDashoffset="23.81" strokeLinecap="round" strokeWidth="1.5" rx="2.5" ry="2.5" />
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 20h14.8m0 0-3.2 3.2m3.2-3.2-3.2-3.2" />
<circle cx="20" cy="20" r="19.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </button>
        </header>
        <div className="main__content main__content--404">
          <div className="main__content-404-inner">
            <h1 className="main__content-404-title">404</h1>
            <p className="main__content-404-subtitle">Страница не найдена</p>
            <p className="main__content-404-text">Возможно, она была удалена или перенесена на другой адрес</p>
            <label htmlFor="tab-3" className="auth-form__submit-wrap main__content-404-back">
              <button type="button" className="btn auth-form__submit">Вернуться на главную</button>
            </label>
          </div>
        </div>
        <div className="main__content main__content--tracks">
          <section className="main__tracks">
            <nav className="main__back-panel" aria-label="Навигация">
              <label htmlFor="tab-3" className="main__back-wrap">
                <button type="button" className="main__back-btn main__filter-btn" aria-label="Вернуться назад">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path stroke="currentColor" strokeWidth="2" d="M10 4 6 8l4 4" />
                  </svg>
                  Назад
                </button>
              </label>
            </nav>
            <h1 className="main__title main__title--main">Треки</h1>
            <h1 className="main__title main__title--playlist-day">Плейлист дня </h1>
            <h1 className="main__title main__title--dance100">100 танцевальных хитов</h1>
            <h1 className="main__title main__title--indie">Инди заряд</h1>
            <h1 className="main__title main__title--favorites">Мои треки</h1>
            <div className="main__filters-panel" role="toolbar" aria-label="Фильтры по трекам">
              <span className="main__filters-label">Искать по:</span>
              <div className="main__filter-btns">
                <div className="main__filter-btn-wrap--artist main__filter-btn-wrap">
                  <button type="button" className="main__filter-btn--artist main__filter-btn" id="filter-artist-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Выбрать исполнителя, 3 в наборе">исполнителю</button>
                  <div className="main__filter-popup--artist main__filter-popup">
                    <ul className="main__filter-list--artist main__filter-list" role="listbox" aria-multiselectable="true" aria-labelledby="filter-artist-btn" tabIndex={-1}>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="michael-jackson" className="main__filter-option-input" defaultChecked />
                          <span>Michael Jackson</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="frank-sinatra" className="main__filter-option-input" defaultChecked />
                          <span>Frank Sinatra</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="calvin-harris" className="main__filter-option-input" />
                          <span>Calvin Harris</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="zhu" className="main__filter-option-input" />
                          <span>Zhu</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="arctic-monkeys" className="main__filter-option-input" />
                          <span>Arctic Monkeys</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="michael-jackson-2" className="main__filter-option-input" />
                          <span>Michael Jackson</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="frank-sinatra-2" className="main__filter-option-input" />
                          <span>Frank Sinatra</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="calvin-harris-2" className="main__filter-option-input" />
                          <span>Calvin Harris</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="zhu-2" className="main__filter-option-input" />
                          <span>Zhu</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-artist" value="arctic-monkeys-2" className="main__filter-option-input" />
                          <span>Arctic Monkeys</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <span className="main__filter-badge--artist main__filter-badge" role="status" aria-live="polite" />
                </div>
                <div className="main__filter-btn-wrap--year main__filter-btn-wrap">
                  <span className="main__filter-badge--year main__filter-badge main__filter-badge--empty" aria-hidden="true" />
                  <button type="button" className="main__filter-btn--year main__filter-btn" id="filter-year-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Выбрать порядок по году выпуска">году выпуска</button>
                  <div className="main__filter-popup--year main__filter-popup">
                    <fieldset className="main__filter-year" aria-labelledby="filter-year-btn">
                      <legend className="visually-hidden">Порядок по году выпуска</legend>
                      <label className="main__filter-year-option--newer main__filter-year-option">
                        <input type="radio" name="filter-year" value="newer" defaultChecked className="main__filter-year-input" />
                        <span className="main__filter-year-radio" aria-hidden="true" />
                        <span>Более новые</span>
                      </label>
                      <label className="main__filter-year-option--older main__filter-year-option">
                        <input type="radio" name="filter-year" value="older" className="main__filter-year-input" />
                        <span className="main__filter-year-radio" aria-hidden="true" />
                        <span>Более старые</span>
                      </label>
                    </fieldset>
                  </div>
                </div>
                <div className="main__filter-btn-wrap--genre main__filter-btn-wrap">
                  <button type="button" className="main__filter-btn--genre main__filter-btn" id="filter-genre-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Выбрать жанр">жанру</button>
                  <div className="main__filter-popup--genre main__filter-popup">
                    <ul className="main__filter-list--genre main__filter-list" role="listbox" aria-labelledby="filter-genre-btn" tabIndex={-1}>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-genre" value="rock" className="main__filter-option-input" />
                          <span>Рок</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-genre" value="hiphop" className="main__filter-option-input" />
                          <span>Хип-хоп</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-genre" value="pop" className="main__filter-option-input" />
                          <span>Поп-музыка</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-genre" value="techno" className="main__filter-option-input" />
                          <span>Техно</span>
                        </label>
                      </li>
                      <li>
                        <label className="main__filter-option">
                          <input type="checkbox" name="filter-genre" value="indie" className="main__filter-option-input" />
                          <span>Инди</span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <span className="main__filter-badge--genre main__filter-badge" role="status" aria-live="polite" aria-label="Выбрано в наборе" />
                  <span className="main__filter-badge--genre main__filter-badge main__filter-badge--empty visually-hidden" role="status" aria-live="polite" aria-label="ничего не выбрано" />
                </div>
              </div>
            </div>
            <table className="tracks-table--main tracks-table">
              <thead>
                <tr>
                  <th>Трек</th>
                  <th>Исполнитель</th>
                  <th>Альбом</th>
                  <th className="tracks-table__duration-col">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" aria-hidden="true" viewBox="0 0 12 12">
<circle cx="6" cy="6" r="5.5" stroke="#696969" strokeWidth="1.2" />
<path stroke="#696969" strokeWidth="1.2" d="M4 6h2.5V2.5" />
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="tracks-table__row--skeleton">
                  <td className="tracks-table__track">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <div className="tracks-table__cover skeleton__cover" aria-hidden="true" />
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__artist">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__album">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__actions">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line skeleton__line--tall" aria-hidden="true" />
                      <span className="skeleton__line skeleton__line--flex-2" aria-hidden="true" />
                    </label>
                  </td>
                </tr>
                <tr className="tracks-table__row--skeleton">
                  <td className="tracks-table__track">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <div className="tracks-table__cover skeleton__cover" aria-hidden="true" />
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__artist">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__album">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__actions">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line skeleton__line--tall" aria-hidden="true" />
                      <span className="skeleton__line skeleton__line--flex-2" aria-hidden="true" />
                    </label>
                  </td>
                </tr>
                <tr className="tracks-table__row--skeleton">
                  <td className="tracks-table__track">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <div className="tracks-table__cover skeleton__cover" aria-hidden="true" />
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__artist">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__album">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__actions">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line skeleton__line--tall" aria-hidden="true" />
                      <span className="skeleton__line skeleton__line--flex-2" aria-hidden="true" />
                    </label>
                  </td>
                </tr>
                <tr className="tracks-table__row--skeleton">
                  <td className="tracks-table__track">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <div className="tracks-table__cover skeleton__cover" aria-hidden="true" />
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__artist">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__album">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__actions">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line skeleton__line--tall" aria-hidden="true" />
                      <span className="skeleton__line skeleton__line--flex-2" aria-hidden="true" />
                    </label>
                  </td>
                </tr>
                <tr className="tracks-table__row--skeleton">
                  <td className="tracks-table__track">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <div className="tracks-table__cover skeleton__cover" aria-hidden="true" />
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__artist">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__album">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line" aria-hidden="true" />
                    </label>
                  </td>
                  <td className="tracks-table__actions">
                    <label htmlFor="tab-8" className="tracks-table__skeleton-label" aria-label="Показать контент">
                      <span className="skeleton__line skeleton__line--tall" aria-hidden="true" />
                      <span className="skeleton__line skeleton__line--flex-2" aria-hidden="true" />
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="tracks-table__track" tabIndex={0} role="button">
                    <label htmlFor="tab-9" className="tracks-table__track-label">
                      <div className="tracks-table__cover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" aria-hidden="true" viewBox="0 0 19 19">
<path stroke="#4e4e4e" strokeWidth="1.5" d="M7.5 15.6v-14m0-.1 11-1m0 .1v12" />
<ellipse cx="4" cy="15.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
<ellipse cx="15" cy="12.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
                        </svg>
                      </div>
                      <p className="tracks-table__title">Guilt</p>
                    </label>
                  </td>
                  <td className="tracks-table__artist"><label htmlFor="tab-9" className="tracks-table__track-label">Nero</label></td>
                  <td className="tracks-table__album"><label htmlFor="tab-9" className="tracks-table__track-label">Welcome Reality</label></td>
                  <td className="tracks-table__actions">
                    <label className="tracks-table__fav-label">
                      <input type="checkbox" className="tracks-table__fav-toggle visually-hidden" aria-label="Избранное" />
                      <button type="button" className="tracks-table__fav-btn" tabIndex={-1} aria-label="Избранное">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" fill="none" aria-hidden="true" className="fav-icon" viewBox="0 0 15 13">
<path d="M7.5 1.8c1-.9 3.4-2.1 5.6-.5 3.4 2.4.3 7.7-5.6 11.2m0-10.7C6.5.9 4-.3 1.9 1.3-1.5 3.7 1.6 9 7.5 12.5" className="fav-icon__heart" />
<path d="M.3.4 14 12.5" className="fav-icon__cross" />
                        </svg>
                      </button>
                    </label>
                    <p className="tracks-table__duration">4:44</p>
                  </td>
                </tr>
                <tr>
                  <td className="tracks-table__track" tabIndex={0} role="button">
                    <label htmlFor="tab-9" className="tracks-table__track-label">
                      <div className="tracks-table__cover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" aria-hidden="true" viewBox="0 0 19 19">
<path stroke="#4e4e4e" strokeWidth="1.5" d="M7.5 15.6v-14m0-.1 11-1m0 .1v12" />
<ellipse cx="4" cy="15.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
<ellipse cx="15" cy="12.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
                        </svg>
                      </div>
                      <p className="tracks-table__title">Guilt</p>
                    </label>
                  </td>
                  <td className="tracks-table__artist"><label htmlFor="tab-9" className="tracks-table__track-label">Nero</label></td>
                  <td className="tracks-table__album"><label htmlFor="tab-9" className="tracks-table__track-label">Welcome Reality</label></td>
                  <td className="tracks-table__actions">
                    <label className="tracks-table__fav-label">
                      <input type="checkbox" className="tracks-table__fav-toggle visually-hidden" aria-label="Избранное" />
                      <button type="button" className="tracks-table__fav-btn" tabIndex={-1} aria-label="Избранное">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" fill="none" aria-hidden="true" className="fav-icon" viewBox="0 0 15 13">
<path d="M7.5 1.8c1-.9 3.4-2.1 5.6-.5 3.4 2.4.3 7.7-5.6 11.2m0-10.7C6.5.9 4-.3 1.9 1.3-1.5 3.7 1.6 9 7.5 12.5" className="fav-icon__heart" />
<path d="M.3.4 14 12.5" className="fav-icon__cross" />
                        </svg>
                      </button>
                    </label>
                    <p className="tracks-table__duration">4:44</p>
                  </td>
                </tr>
                <tr>
                  <td className="tracks-table__track" tabIndex={0} role="button">
                    <label htmlFor="tab-9" className="tracks-table__track-label">
                      <div className="tracks-table__cover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" aria-hidden="true" viewBox="0 0 19 19">
<path stroke="#4e4e4e" strokeWidth="1.5" d="M7.5 15.6v-14m0-.1 11-1m0 .1v12" />
<ellipse cx="4" cy="15.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
<ellipse cx="15" cy="12.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
                        </svg>
                      </div>
                      <p className="tracks-table__title">Guilt</p>
                    </label>
                  </td>
                  <td className="tracks-table__artist"><label htmlFor="tab-9" className="tracks-table__track-label">Nero</label></td>
                  <td className="tracks-table__album"><label htmlFor="tab-9" className="tracks-table__track-label">Welcome Reality</label></td>
                  <td className="tracks-table__actions">
                    <label className="tracks-table__fav-label">
                      <input type="checkbox" className="tracks-table__fav-toggle visually-hidden" aria-label="Избранное" />
                      <button type="button" className="tracks-table__fav-btn" tabIndex={-1} aria-label="Избранное">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" fill="none" aria-hidden="true" className="fav-icon" viewBox="0 0 15 13">
<path d="M7.5 1.8c1-.9 3.4-2.1 5.6-.5 3.4 2.4.3 7.7-5.6 11.2m0-10.7C6.5.9 4-.3 1.9 1.3-1.5 3.7 1.6 9 7.5 12.5" className="fav-icon__heart" />
<path d="M.3.4 14 12.5" className="fav-icon__cross" />
                        </svg>
                      </button>
                    </label>
                    <p className="tracks-table__duration">4:44</p>
                  </td>
                </tr>
                <tr>
                  <td className="tracks-table__track" tabIndex={0} role="button">
                    <label htmlFor="tab-9" className="tracks-table__track-label">
                      <div className="tracks-table__cover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" aria-hidden="true" viewBox="0 0 19 19">
<path stroke="#4e4e4e" strokeWidth="1.5" d="M7.5 15.6v-14m0-.1 11-1m0 .1v12" />
<ellipse cx="4" cy="15.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
<ellipse cx="15" cy="12.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
                        </svg>
                      </div>
                      <p className="tracks-table__title">Guilt</p>
                    </label>
                  </td>
                  <td className="tracks-table__artist"><label htmlFor="tab-9" className="tracks-table__track-label">Nero</label></td>
                  <td className="tracks-table__album"><label htmlFor="tab-9" className="tracks-table__track-label">Welcome Reality</label></td>
                  <td className="tracks-table__actions">
                    <label className="tracks-table__fav-label">
                      <input type="checkbox" className="tracks-table__fav-toggle visually-hidden" aria-label="Избранное" />
                      <button type="button" className="tracks-table__fav-btn" tabIndex={-1} aria-label="Избранное">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" fill="none" aria-hidden="true" className="fav-icon" viewBox="0 0 15 13">
<path d="M7.5 1.8c1-.9 3.4-2.1 5.6-.5 3.4 2.4.3 7.7-5.6 11.2m0-10.7C6.5.9 4-.3 1.9 1.3-1.5 3.7 1.6 9 7.5 12.5" className="fav-icon__heart" />
<path d="M.3.4 14 12.5" className="fav-icon__cross" />
                        </svg>
                      </button>
                    </label>
                    <p className="tracks-table__duration">4:44</p>
                  </td>
                </tr>
                <tr>
                  <td className="tracks-table__track" tabIndex={0} role="button">
                    <label htmlFor="tab-9" className="tracks-table__track-label">
                      <div className="tracks-table__cover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" aria-hidden="true" viewBox="0 0 19 19">
<path stroke="#4e4e4e" strokeWidth="1.5" d="M7.5 15.6v-14m0-.1 11-1m0 .1v12" />
<ellipse cx="4" cy="15.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
<ellipse cx="15" cy="12.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
                        </svg>
                      </div>
                      <p className="tracks-table__title">Guilt</p>
                    </label>
                  </td>
                  <td className="tracks-table__artist"><label htmlFor="tab-9" className="tracks-table__track-label">Nero</label></td>
                  <td className="tracks-table__album"><label htmlFor="tab-9" className="tracks-table__track-label">Welcome Reality</label></td>
                  <td className="tracks-table__actions">
                    <label className="tracks-table__fav-label">
                      <input type="checkbox" className="tracks-table__fav-toggle visually-hidden" aria-label="Избранное" />
                      <button type="button" className="tracks-table__fav-btn" tabIndex={-1} aria-label="Избранное">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" fill="none" aria-hidden="true" className="fav-icon" viewBox="0 0 15 13">
<path d="M7.5 1.8c1-.9 3.4-2.1 5.6-.5 3.4 2.4.3 7.7-5.6 11.2m0-10.7C6.5.9 4-.3 1.9 1.3-1.5 3.7 1.6 9 7.5 12.5" className="fav-icon__heart" />
<path d="M.3.4 14 12.5" className="fav-icon__cross" />
                        </svg>
                      </button>
                    </label>
                    <p className="tracks-table__duration">4:44</p>
                  </td>
                </tr>

              </tbody>
            </table>
          </section>
          <aside className="categories--main categories">
            <nav aria-label="Плейлисты">
            <ul className="categories__list">
              <li className="categories__item--skeleton"><label htmlFor="tab-8" className="categories__skeleton-label" aria-label="Показать контент" /></li>
              <li className="categories__item--skeleton"><label htmlFor="tab-8" className="categories__skeleton-label" aria-label="Показать контент" /></li>
              <li className="categories__item--skeleton"><label htmlFor="tab-8" className="categories__skeleton-label" aria-label="Показать контент" /></li>
              <li><label htmlFor="tab-4" className="categories__label"><a href="#" className="categories__link categories__link--playlist-day">Плейлист дня</a></label></li>
              <li><label htmlFor="tab-5" className="categories__label"><a href="#" className="categories__link categories__link--dance100">100 танцевальных хитов</a></label></li>
              <li><label htmlFor="tab-6" className="categories__label"><a href="#" className="categories__link categories__link--indie">Инди заряд</a></label></li>
            </ul>
            </nav>
          </aside>
        </div>
      </main>
      <footer className="player-bar--app player-bar">
        <div className="player-bar__controls">
          <button type="button" className="player-bar__control-btn player-bar__control-btn--play" aria-label="Предыдущий трек">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="none" className="player-bar__control-icon" viewBox="0 0 16 14">
<path stroke="currentColor" d="M.5 2v10.5" />
<path fill="currentColor" d="m2.5 7 9.8-6v12z" />
            </svg>
          </button>
          <label className="player-bar__control-label player-bar__control-label--play">
            <input type="checkbox" className="player-bar__control-toggle visually-hidden" aria-label="Воспроизвести" defaultChecked />
            <button type="button" className="player-bar__control-btn player-bar__control-btn--play" tabIndex={-1} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="20" fill="none" aria-hidden="true" className="player-bar__play-icon" viewBox="0 0 15 20"><path fill="currentColor" d="M15 9.5 0 0v19z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="19" fill="none" aria-hidden="true" className="player-bar__pause-icon" viewBox="0 0 15 19"><path fill="currentColor" d="M0 0h5v19H0zm10 0h5v19h-5z" /></svg>
            </button>
          </label>
          <button type="button" className="player-bar__control-btn player-bar__control-btn--play" aria-label="Следующий трек">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="none" aria-hidden="true" className="player-bar__control-icon" viewBox="0 0 16 14">
<path stroke="currentColor" d="M15 2v10.5" />
<path fill="currentColor" d="M13 7 3.3 1v12z" />
</svg>
          </button>
          <label className="player-bar__control-label">
            <input type="checkbox" className="player-bar__control-toggle visually-hidden" aria-label="Перемешать" />
            <button type="button" className="player-bar__control-btn player-bar__control-btn--alt" tabIndex={-1} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none" aria-hidden="true" className="player-bar__control-icon" viewBox="-0.5 0 20 18"><path fill="currentColor" stroke="currentColor" strokeWidth=".5" d="M9.5 2.9 4.5 0v5.8zm-3 11.5c-3 0-5.5-2.5-5.5-5.5H0c0 3.6 3 6.5 6.5 6.5zM1 8.9c0-3 2.5-5.5 5.5-5.5v-1A6.5 6.5 0 0 0 0 8.9zm8.5 6 5 2.9V12zm3-11.5c3 0 5.5 2.4 5.5 5.5h1c0-3.6-3-6.5-6.5-6.5zM18 8.9c0 3-2.5 5.5-5.5 5.5v1c3.6 0 6.5-3 6.5-6.5z" paint-order="stroke fill" /></svg>
            </button>
          </label>
          <label className="player-bar__control-label">
            <input type="checkbox" className="player-bar__control-toggle visually-hidden" aria-label="Повторить" />
            <button type="button" className="player-bar__control-btn player-bar__control-btn--alt" tabIndex={-1} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none" aria-hidden="true" className="player-bar__control-icon" viewBox="-0.5 0 20 18">
<path fill="currentColor" stroke="currentColor" strokeWidth=".5" d="M19 14.9 14 12v5.8zm-9.3-3-.5.3zm-2.9-6-.4.2zM0 3.4h2.3v-1H0zM6.4 6l2.8 6.2 1-.4-3-6.2zm7.8 9.4h.3v-1h-.3zm-5-3.2c.9 2 2.9 3.2 5 3.2v-1q-2.8-.1-4-2.6zm-7-8.8q3 .1 4.2 2.6l.9-.4c-.9-2-2.9-3.2-5-3.2z" paint-order="stroke fill" />
<path fill="currentColor" stroke="currentColor" strokeWidth=".5" d="m19 2.9-5 2.9V0zM9.7 5.8l-.5-.2zM6.8 12l-.4-.2zM0 14.4h2.3v1H0zm6.4-2.6 2.8-6.2 1 .4-3 6.2zm7.8-9.4h.3v1h-.3zm-5 3.2c.9-2 2.9-3.2 5-3.2v1q-2.8.1-4 2.6zm-7 8.8q3-.1 4.2-2.6l.9.4c-.9 2-2.9 3.2-5 3.2z" paint-order="stroke fill" />
              </svg>
            </button>
          </label>
        </div>
        <div className="player-bar__track-info">
          <div className="player-bar__track-cover">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" aria-hidden="true" viewBox="0 0 19 19">
<path stroke="#4e4e4e" strokeWidth="1.5" d="M7.5 15.6v-14m0-.1 11-1m0 .1v12" />
<ellipse cx="4" cy="15.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
<ellipse cx="15" cy="12.547" stroke="#4e4e4e" strokeWidth="1.5" rx="3.5" ry="2" />
            </svg>
          </div>
          <div className="player-bar__track-details">
            <p className="player-bar__track-title">Ты та...</p>
            <p className="player-bar__track-artist">Баста</p>
          </div>
          <label className="player-bar__fav-label">
          <input type="checkbox" className="player-bar__fav-toggle visually-hidden" aria-label="Избранное" />
          <button type="button" className="player-bar__action-btn player-bar__action-btn--fav" tabIndex={-1} aria-label="Избранное">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" fill="none" aria-hidden="true" className="fav-icon" viewBox="0 0 15 13">
<path d="M7.5 1.8c1-.9 3.4-2.1 5.6-.5 3.4 2.4.3 7.7-5.6 11.2m0-10.7C6.5.9 4-.3 1.9 1.3-1.5 3.7 1.6 9 7.5 12.5" className="fav-icon__heart" />
<path d="M.3.4 14 12.5" className="fav-icon__cross" />
            </svg>
          </button>
          </label>
        </div>
        <label htmlFor="tab-8" className="player-bar__track-info player-bar__track-info--skeleton" aria-label="Показать контент">
          <div className="player-bar__track-cover skeleton__cover" aria-hidden="true" />
          <div className="player-bar__track-details">
            <span className="skeleton__line skeleton__line--short skeleton__line--with-gap" aria-hidden="true" />
            <span className="skeleton__line skeleton__line--short" aria-hidden="true" />
          </div>
          <span className="player-bar__fav-skeleton skeleton__line skeleton__line--tall" aria-hidden="true" />
        </label>
        <input
          type="range"
          className="player-bar__volume"
          min={0}
          max={100}
          defaultValue={50}
          aria-label="Громкость"
          onInput={(e) => {
            const t = e.currentTarget
            const pct = ((Number(t.value) - Number(t.min)) / (Number(t.max) - Number(t.min))) * 100
            t.style.setProperty(
              '--value',
              `${pct}%`,
            )
          }}
        />
      </footer>
      </div>
    </div>
  )
}
