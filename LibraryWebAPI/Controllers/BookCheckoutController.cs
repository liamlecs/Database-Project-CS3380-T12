// Controllers/BookCheckoutController.cs
using Microsoft.AspNetCore.Mvc;
using LibraryWebAPI.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using LibraryWebAPI.Models;

namespace LibraryWebAPI.Controllers
{
    public class BookCheckoutController : Controller
    {
        // in-memory data for simplicity
        private static List<BookCheckout> BookCheckouts = new List<BookCheckout>
        {
            new BookCheckout { BookId = 1, CustomerId = 101, CheckoutDate = DateTime.Now.AddDays(-5), DueDate = DateTime.Now.AddDays(5), IsReturned = false },
            new BookCheckout { BookId = 2, CustomerId = 102, CheckoutDate = DateTime.Now.AddDays(-3), DueDate = DateTime.Now.AddDays(7), IsReturned = true },
        };

        // get a list of all book checkouts
        public IActionResult Index()
        {
            return View(BookCheckouts);
        }

        // view details of a specific book checkout
        public IActionResult Details(int id)
        {
            var checkout = BookCheckouts.FirstOrDefault(b => b.BookId == id);
            if (checkout == null)
                return NotFound();
            return View(checkout);
        }

        // return a form for creating a new checkout
        public IActionResult Create()
        {
            return View();
        }

        // handle form submission for creating a new checkout
        [HttpPost]
        public IActionResult Create(BookCheckout model)
        {
            if (ModelState.IsValid)
            {
                model.CheckoutDate = DateTime.Now;
                model.IsReturned = false;
                BookCheckouts.Add(model);
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // return a form for updating an existing checkout
        public IActionResult Edit(int id)
        {
            var checkout = BookCheckouts.FirstOrDefault(b => b.BookId == id);
            if (checkout == null)
                return NotFound();
            return View(checkout);
        }

        // handle form submission for updating an existing checkout
        [HttpPost]
        public IActionResult Edit(BookCheckout model)
        {
            var checkout = BookCheckouts.FirstOrDefault(b => b.BookId == model.BookId);
            if (checkout == null)
                return NotFound();

            checkout.ReturnDate = model.ReturnDate;
            checkout.IsReturned = true;
            return RedirectToAction("Index");
        }
    }
}
