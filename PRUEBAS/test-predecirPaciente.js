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

    await page.goto('http://localhost:4200/paciente/1');

    const buttonView = page.locator('button[name="view"]');
    await Promise.all([page.waitForNavigation(), buttonView.click()]);

    sleep(2);

    const buttonPredict = page.locator('button[name="predict"]');
    await Promise.all([page.waitForNavigation(), buttonPredict.click()]);

    sleep(10);

    check(page, {
        'predicted': p => p => p.locator('div').textContent() == ' Not cancer (label 0),  score: 0.984481368213892 ',
    });
    

  } finally {
    page.close();
  }
}