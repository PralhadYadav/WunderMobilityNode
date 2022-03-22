import { Injectable } from '@nestjs/common';
import { offers } from './common/promotional_rules/offers';
import { LoggerService } from './common/services/logger/logger.service';

/**
 * @description Appservice use to return api requests response data
 */
@Injectable()
export class AppService {

  /**
  * @description loggerService use to log all the error or logs.
  */
  private readonly loggerService: LoggerService = new LoggerService(AppService.name)

  /**
* @description getHello method use to define default route.
*/
  getHello(): string {
    return 'Hello Shoppers!!';
  }

  /**
* @description getCartPrice method use to calcute final cart price after applying promo codes.
*/
  getCartPrice(data: any) {
    try {
      let offersArr = offers.map(obj => ({ ...obj }))
      let cartValue: number = 0;
      for (let offer of offersArr) {
        if (offer.productId) {
          let cartProduct = data.filter(x => x.productId == offer.productId)[0];
          if (cartProduct && cartProduct.count >= offer.eligibleProductCount) {
            cartProduct.price = cartProduct.price * cartProduct.count;
            console.log("cartValue before ", cartValue)
            if (cartValue > 0) {
              cartValue = offer.discountedPercent > 0 ? cartValue - (cartProduct.price * offer.discountedPercent) :
                offer.offerAppliedOnEach ? cartValue - (offer.discountedAmount * cartProduct.count) :
                  cartValue - (offer.discountedAmount);
            } else {
              cartValue += offer.discountedPercent > 0 ? cartProduct.price - (cartProduct.price * offer.discountedPercent) :
                offer.offerAppliedOnEach ? cartProduct.price - (offer.discountedAmount * cartProduct.count) :
                  cartProduct.price - (offer.discountedAmount);
            }

            console.log("cartValue after ", cartValue)
            offer.isApplied = true;
          }
        }
        else if (offer.category != "all") {
          let eligibleProductCount: boolean = false;
          let productsCount = 0;
          let cartProduct = data.filter(x => x.category == offer.category);
          if (cartProduct.length >= offer.eligibleProductCount) eligibleProductCount = true;
          else {
            for (let product of cartProduct) {
              productsCount += product.count;
              if (productsCount >= offer.eligibleProductCount) {
                eligibleProductCount = true;
                break;
              }
            }
          }
          if (eligibleProductCount) {
            if (offer.offerAppliedOnEach) {
              cartProduct.map(x => {
                x.price = x.price * x.count;
                cartValue += offer.discountedPercent > 0 ? x.price - (x.price * offer.discountedPercent) : x.price - (offer.discountedAmount * x.count);
              })
              offer.isApplied = true;
            } else {
              let initialProductPrice = cartProduct.reduce((a, b) => a + (b.price * b.count), 0);
              cartValue += offer.discountedPercent > 0 ? initialProductPrice - (initialProductPrice * offer.discountedPercent) : initialProductPrice - offer.discountedAmount;
              offer.isApplied = true;
            }
          }
        } else if (offer.category == "all") {
          let requestCartValue = data.reduce((a, b) => a + (b.price * b.count), 0);
          if (requestCartValue >= offer.eligibleCartValue) {
            cartValue = offer.discountedPercent > 0 ? cartValue - (cartValue * offer.discountedPercent) : cartValue - offer.discountedAmount;
            offer.isApplied = true;
          }
        }
      }
      return {
        status: 200,
        messege: "success",
        data: [{
          "cartValue": cartValue > 0 ? cartValue : "No Offer Applied",
          offers: offersArr
        }]
      };
    } catch (err) {
      this.loggerService.error("Error from getCartPrice function", err)
    }
  }
}
