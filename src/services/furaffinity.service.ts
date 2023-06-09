import { Subject, Observable, timer } from 'rxjs';
import jQuery from 'jquery';

export interface SubmissionPage {
    id: string;
    url: string;
    imgUrl: string;
    title: string;
    data?: any;
    skip?: boolean;
}

export interface SubmissionData {
    title: string;
    description: string;
    rating: string;
    tags: string[];
    imageURL: string;
    scraps: boolean;
}

export class FurAffinityService {
    private readonly URL: string = 'https://www.furaffinity.net';
    public countSubject: Subject<number>;
    public countObserver: Observable<number>;

    constructor() {
        this.countSubject = new Subject();
        this.countObserver = this.countSubject.asObservable();
    }

    public checkLogin(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fetch(`${this.URL}/controls/settings/`)
                .then(async res => {
                    const text = await res.text();
                    const loggedIn = !text.includes('Please log in');
                    console.log(`Logged in: ${loggedIn}`);
                    if (loggedIn) {
                        resolve();
                    } else {
                        reject();
                    }
                }).catch(err => {
                console.error(err);
                reject();
            });
        });
    }

    public async fetchSubmissionData(submissions: SubmissionPage[], progressCallback: Function): Promise<any> {
        this.countSubject.next(0);

        for (let i = 0; i < submissions.length; i++) {
            const s = submissions[i];
            if (!s.data) {
                await this._fetchData(s);
            }

            this.countSubject.next(i + 1);
            progressCallback({
                id: submissions[i].id
            });
        }
    }

    private _fetchData(submission: SubmissionPage): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await fetch(submission.url)
                .then((async res => {
                    const text = await res.text();
                    const data: any = {};
                    const html$ = jQuery(jQuery.parseHTML(text));
                    const img$ = html$.find('#submissionImg');
                    const date$ = html$.find('.popup_date');
                    const date = new Date(date$.attr('title'));
                    data.id = submission.id;
                    data.title = submission.title;
                    data.image = `https:${img$.attr('data-fullview-src')}`;
                    data.date = date.getTime();

                    if (!img$.attr('data-fullview-src')) {
                        alert(`Unable to retrieve source for submission "${data.title}". Turn off SFW mode if it is enabled and restart the export.`);
                        resolve();
                        return;
                    }

                    timer(1000).subscribe(() => {
                        fetch(`${this.URL}/controls/submissions/changeinfo/${submission.id}`)
                            .then(async res => {
                                const info = await res.text();
                                const html$ = jQuery.parseHTML(info);
                                data.description = jQuery(html$).find('[name="message"]').text();
                                data.rating = this._convertRating(jQuery(html$).find('[name="rating"]:checked').prop('value'));
                                data.scrap = jQuery(html$).find('[name="scrap"]').prop('checked');
                                data.tags = (jQuery(html$).find('[name="keywords"]').text() || '').split(' ');

                                submission.data = data;
                                resolve();
                            }, err => {
                                console.error(err);
                                reject();
                            });

                    });

                }), err => {
                    console.error(err);
                    reject();
                });
        });
    }

    public async loadAllSubmissions(progressCallback: Function): Promise<SubmissionPage[]> {
        let data: SubmissionPage[] = [];

        let count: number = 0;
        while (true) { // yeah im using a while true... deal with it
            const pageData: SubmissionPage[] = await this._loadSubmissions(count, progressCallback);
            count++;

            if (pageData.length > 0) {
                data = [...data, ...pageData];
            } else {
                break;
            }
        }

        return data;
    }

    public _loadSubmissions(page: number = 0, progressCallback?: Function): Promise<SubmissionPage[]> {
        return new Promise((resolve, reject) => {
            timer(2000).subscribe(() => {
                fetch(`${this.URL}/controls/submissions/${page}`)
                    .then(async res => {
                        const submissions = await res.text();
                        try {
                            const items: SubmissionPage[] = [];
                            const html$ = jQuery.parseHTML(submissions);
                            const figs$ = jQuery(html$).find('figure');

                            if (figs$.length > 0) {
                                jQuery(figs$).each((_index, item) => {
                                    try {
                                        const view = jQuery(item).find('a');
                                        const img = jQuery(item).find('img');
                                        const title = jQuery(item).find('label');
                                        const id = jQuery(item).prop('id').replace('sid-', '');

                                        items.push({
                                            id: id,
                                            url: `${view.prop('href')}`,
                                            imgUrl: `${img.prop('src')}`,
                                            title: title.text(),
                                            data: null,
                                            skip: false
                                        });

                                        if (progressCallback) progressCallback({
                                            id
                                        });
                                    } catch (e) {
                                        console.log('Submission needs to be skipped')
                                        console.error(e);
                                    }
                                });
                            }

                            resolve(items);
                        } catch (err) {
                            console.error(err);
                            reject(err);
                        }
                    }).catch(err => {
                    console.error(err);
                    reject(err);
                });
            });
        });
    }

    private _convertRating(rating: string): string {
        switch (rating) {
            case '0':
                return 'General';
            case '1':
                return 'Mature';
            case '2':
                return 'Adult';
            default:
                return 'Unknown';
        }
    }
}
