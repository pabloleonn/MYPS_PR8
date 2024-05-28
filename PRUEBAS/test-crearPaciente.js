import { browser } from 'k6/experimental/browser';
import { check, sleep } from 'k6';


export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations', // para realizar iteraciones sin indicar el tiempo
            options: {
                browser: {
                    type: 'chromium',
                }
            }
        }
    },
    thresholds: {
        checks: ["rate==1.0"]
    }
}

export default async function () {
    const page = browser.newPage();
    try {
        await page.goto('http://localhost:4200/');


        page.locator('input[name="nombre"]').type('Manolo');
        page.locator('input[name="DNI"]').type('123');
        const submitButton = page.locator('button[name="login"]');
        await Promise.all([page.waitForNavigation(), submitButton.click()]);

        sleep(5);
        check(page, {
            'header': p => p => p.locator('h2').textContent() == 'Listado de pacientes',
        });

        const buttonAdd = page.locator('button[name="add"]');
        await Promise.all([page.waitForNavigation(), buttonAdd.click()]);
        sleep(2);

        page.locator('input[name="dni"]').type('11111111A');
        page.locator('input[name="nombre"]').type('Juan');
        page.locator('input[name="edad"]').type('65');
        page.locator('input[name="cita"]').type('Prostata');

        const submitButton2 = page.locator('button[type="submit"]');
        await Promise.all([page.waitForNavigation(), submitButton2.click()]);

        sleep(5);



        let len = page.$$("table tbody tr").length;

        console.log(parseInt(p.$$("table tbody tr")[len - 1]));

        check(page, {
            'dni': p => parseInt(p.$$("table tbody tr")[len - 1]
                .$('td[name="dni"]').textContent()) == '11111111A',
        });

    } finally {
        page.close();
    }
}