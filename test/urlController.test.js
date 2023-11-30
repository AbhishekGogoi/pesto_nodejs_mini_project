const chai = require('chai');
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http'); // Import chai-http for making HTTP requests
const { app, server } = require('../index');
const urlRoutes = require('../src/routes/urlRoutes');
const redirectRoutes = require('../src/routes/redirectRoutes');
const generateToken = require('../src/config/jwt');
const User = require('../src/models/User');
const Url = require('../src/models/Url'); // Adjust the path based on your project structure
const urlController = require('../src/controllers/urlController');
const {validateUrl } = require('../src/utils/urlValidator');

chai.use(chaiHttp);



    describe('shortenUrl', () => {
      it('should shorten a URL with valid inputs', async () => {
        // Mock data for the request
        const req = {
          body: { originalUrl: 'https://www.youtube.com/' },
          user: { id: '6555a9ac1a0ea00667cf482a' },
        };
  
        // Stubbing the findOne method of the Url model
        const findOneStub = sinon.stub(require('../src/models/Url'), 'findOne');
        findOneStub.resolves(null); // Simulate that the URL is not found
  
        // Stubbing the save method of the Url model
        const saveStub = sinon.stub(require('../src/models/Url').prototype, 'save');
        saveStub.resolves({}); // Simulate successful save
  
        // Making the API request
        const response = await chai
          .request(app)
          .post('/api/url/shorten')
          .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTVhOWFjMWEwZWEwMDY2N2NmNDgyYSIsInVzZXJuYW1lIjoiYWJoaXNoZWsiLCJwYXNzd29yZCI6IiQyYSQxMCRCVlI5Tlp6UlJKYXgxeVpZM2ZFeDBlcmdOM2dyMzZhWWRrUC93a3JCWFk1QVYxaFRyZjAzZSIsIl9fdiI6MH0sImlhdCI6MTcwMDczNjYzNSwiZXhwIjoxNzAwNzQwMjM1fQ.3h-Kt4gNuIyvrBxmL1ussm8RoXrC3Nzd0JbV1RvdDjI')
          .send(req.body);
  
        // Assertions
        expect(response.status).to.equal(200);
        expect(response.body.shortUrl).to.not.be.empty;
  
        // Restore stubs
        findOneStub.restore();
        saveStub.restore();
      });
    
      it('should handle validation errors with invalid URL', async () => {
        const req = {
          body: { originalUrl: 'https://www.asa.sas' },
          user: { id: '6555a9ac1a0ea00667cf482a' },
        };
      
        const findOneStub = sinon.stub(require('../src/models/Url'), 'findOne');
        findOneStub.resolves(null);
      
        const saveStub = sinon.stub(require('../src/models/Url').prototype, 'save');
        saveStub.resolves({});
      
        const response = await chai
          .request(app)
          .post('/api/url/shorten')
          .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTVhOWFjMWEwZWEwMDY2N2NmNDgyYSIsInVzZXJuYW1lIjoiYWJoaXNoZWsiLCJwYXNzd29yZCI6IiQyYSQxMCRCVlI5Tlp6UlJKYXgxeVpZM2ZFeDBlcmdOM2dyMzZhWWRrUC93a3JCWFk1QVYxaFRyZjAzZSIsIl9fdiI6MH0sImlhdCI6MTcwMDczNjYzNSwiZXhwIjoxNzAwNzQwMjM1fQ.3h-Kt4gNuIyvrBxmL1ussm8RoXrC3Nzd0JbV1RvdDjI')
          .send(req.body);
      
        expect(response).to.have.status(400); // Adjust the status code as needed
        expect(response.body).to.have.property('errors');
        expect(response.body.errors).to.be.an('array');
      
        findOneStub.restore();
        saveStub.restore();
      });
    });
    
  

    // describe('redirectToOriginalUrl', () => {
    //     let server;
    //     let findOneStub;
      
    //     before(async () => {
    //       // Start the server before running the tests
    //       server = await app.listen(0); // Use port 0 to let the system choose an available port
    //     });
      
    //     beforeEach(() => {
    //       findOneStub = sinon.stub(Url, 'findOne');
    //     });
      
    //     afterEach(() => {
    //       findOneStub.restore();
    //     });
      
    //     after((done) => {
    //       // Close the server after running the tests
    //       server.close(() => {
    //         done();
    //       });
    //     });
      
    //     it('should redirect to the original URL', async () => {
    //         const existingUrl = {
    //           urlId: 'urnZgXH1v',
    //           originalUrl: 'https://www.amazon.com/',
    //         };
          
    //         findOneStub.withArgs({ urlId: existingUrl.urlId }).resolves(existingUrl);
          
    //         const response = await chai.request(app).get(`/${existingUrl.urlId}`);
          
    //         expect(response).to.have.status(200);
    //         expect(response).to.redirectTo(existingUrl.originalUrl);
          
    //         sinon.assert.calledOnce(findOneStub);
    //         sinon.assert.calledWith(findOneStub, { urlId: existingUrl.urlId });
    //       });
      
    //       it('should handle not finding the URL', async () => {
    //         // Making the API request with an invalid urlId
    //         const response = await chai
    //           .request(app)
    //           .get('/ert45df6'); // Replace 'invalidUrlId' with an invalid urlId
        
    //         // Assertions
    //         expect(response).to.have.status(404);
    //         expect(response.body).to.equal('Url not found');
        
    //         // Ensure that Url.findOne was called with the provided urlId
    //         sinon.assert.calledOnce(findOneStub);
    //         sinon.assert.calledWith(findOneStub, { urlId: 'ert45df6' });
    //       });
        
    //   });


    // describe('getUserUrls', () => {
    //     let user;
      
    //     beforeEach(() => {
    //       // Simulate an authenticated user
    //       user = { _id: '6555a9ac1a0ea00667cf482a' };
    //     });
      
    //     it('should return status 200 for all URLs for the authenticated user', async () => {
    //       const response = await chai.request(app)
    //         .get('/api/url/manage') // No userId query parameter for the positive scenario
    //         .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTYwYWVmZjliZmE4MTljMTZiZmRjMSIsInVzZXJJZCI6IjY1NTYwYWVmZjliZmE4MTljMTZiZmRjMCIsInVzZXJuYW1lIjoiQWJoaXNoZWtHb2dvaSIsInBhc3N3b3JkIjoiJDJhJDEwJFhIanZVVksvYjc4ekExMHdJb0VmSWVQNEU4RS4ybkFZWDhLaXdzUU5ORzR6akRTaFlOSUx5IiwiX192IjowfSwiaWF0IjoxNzAwNzM1MDU1LCJleHAiOjE3MDA3Mzg2NTV9.ojwb8CmUavuxOS6QNak1vwfntRwOZAyELAsGO9-dfvc'); // Replace with an actual valid token for testing
      
    //       expect(response).to.have.status(200);
    //       expect(response.body).to.be.an('array'); // Assuming the response is an array of URLs
    //     });
      
    //     it('should handle no user URLs found', async () => {
    //       const response = await chai.request(app)
    //         .get('/api/url/manage') // No userId query parameter for the negative scenario
    //         .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTYwYWVmZjliZmE4MTljMTZiZmRjMSIsInVzZXJJZCI6IjY1NTYwYWVmZjliZmE4MTljMTZiZmRjMCIsInVzZXJuYW1lIjoiQWJoaXNoZWtHb2dvaSIsInBhc3N3b3JkIjoiJDJhJDEwJFhIanZVVksvYjc4ekExMHdJb0VmSWVQNEU4RS4ybkFZWDhLaXdzUU5ORzR6akRTaFlOSUx5IiwiX192IjowfSwiaWF0IjoxNzAwNzM1MDU1LCJleHAiOjE3MDA3Mzg2NTV9.ojwb8CmUavuxOS6QNak1vwfntRwOZAyELAsGO9-dfvc'); // Replace with an actual valid token for testing
      
    //       expect(response).to.have.status(404);
    //       expect(response.body).to.deep.equal({ msg: 'No URLs found for the user' });
    //     });
    //   });


    // describe('positive testing - updateUserUrls', () => {
    //     let updateOneStub;
      
    //     beforeEach(() => {
    //       // Stubbing the updateOne method of the Url model
    //       updateOneStub = sinon.stub(Url.prototype, 'updateOne');
    //     });
      
    //     afterEach(() => {
    //       // Restore stub after each test
    //       updateOneStub.restore();
    //     });
      
    //     it('should update a user URL', async () => {
    //       // Mock data for the request
    //       const req = {
    //         user: { id: '6555a9ac1a0ea00667cf482a' },
    //         params: { id: '65585bc576f6dc7179501576' },
    //         body: { originalUrl: 'https://www.twitter.com/' },
    //       };
      
    //       // Simulate a successful update
    //       const updatedUrlData = {
    //         _id: req.params.id,
    //         urlId: 'vqCTxBWpS',
    //         originalUrl: 'https://www.twitter.com/',
    //         shortUrl: 'http://localhost:5000/vqCTxBWpS',
    //         user: '6555a9ac1a0ea00667cf482a',
    //       };
      
    //       // Configure the stub to resolve with the updated data
    //       updateOneStub.resolves({
    //         n: 1,
    //         nModified: 1,
    //         ok: 1,
    //       });
      
    //       // Making the API request
    //       const response = await chai
    //         .request(app)
    //         .put(`/api/url/${req.params.id}`)
    //         .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTVhOWFjMWEwZWEwMDY2N2NmNDgyYSIsInVzZXJuYW1lIjoiYWJoaXNoZWsiLCJwYXNzd29yZCI6IiQyYSQxMCRCVlI5Tlp6UlJKYXgxeVpZM2ZFeDBlcmdOM2dyMzZhWWRrUC93a3JCWFk1QVYxaFRyZjAzZSIsIl9fdiI6MH0sImlhdCI6MTcwMDcyMzA3NCwiZXhwIjoxNzAwNzI2Njc0fQ.E6QbBiZAI2k6BiyigvtJ9I0zUUrpPizzx3jDjuty4cQ') // Replace with your actual auth token
    //         .send(req.body);
      
    //       // Assertions
    //       expect(response.status).to.equal(200);
    //       expect(response.body).to.be.an('object');
    //       // Add more assertions based on your actual response structure
    //     });
      
    //     it('should handle updating a nonexistent user URL', async () => {
    //       // Mock data for the request
    //       const req = {
    //         user: { id: '6555a9ac1a0ea00667cf482a' },
    //         params: { id: '65585bc576f6dc7179501577' },
    //         body: { originalUrl: 'https://www.twitter.com/' },
    //       };
      
    //       // Configure the stub to resolve with no modification
    //       updateOneStub.resolves({
    //         n: 0,
    //         nModified: 0,
    //         ok: 1,
    //       });
      
    //       // Making the API request
    //       const response = await chai
    //         .request(app)
    //         .put(`/api/url/${req.params.id}`)
    //         .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTVhOWFjMWEwZWEwMDY2N2NmNDgyYSIsInVzZXJuYW1lIjoiYWJoaXNoZWsiLCJwYXNzd29yZCI6IiQyYSQxMCRCVlI5Tlp6UlJKYXgxeVpZM2ZFeDBlcmdOM2dyMzZhWWRrUC93a3JCWFk1QVYxaFRyZjAzZSIsIl9fdiI6MH0sImlhdCI6MTcwMDcyMzA3NCwiZXhwIjoxNzAwNzI2Njc0fQ.E6QbBiZAI2k6BiyigvtJ9I0zUUrpPizzx3jDjuty4cQ') // Replace with your actual auth token
    //         .send(req.body);
      
    //       // Assertions
    //       expect(response.status).to.equal(404);
    //       expect(response.body).to.be.an('object');
    //       expect(response.body.msg).to.equal('URL not found');
    //     });
    //   });
      


    // describe('deleteUrl', () => {
    //     let deleteOneStub;
      
    //     beforeEach(() => {
    //       // Stubbing the deleteOne method of the Url model
    //       deleteOneStub = sinon.stub(Url.prototype, 'deleteOne');
    //     });
      
    //     afterEach(() => {
    //       // Restore stubs after each test
    //       deleteOneStub.restore();
    //     });
      
    //     it('should delete a user URL', async () => {
    //       // Mock data for the request
    //       const req = {
    //         params: { id: '65585bc576f6dc7179501576' },
    //       };
      
    //       // Simulate that the URL is found and deleted
    //       deleteOneStub.resolves({ n: 1, ok: 1, deletedCount: 1 });
      
    //       // Making the API request
    //       const response = await chai
    //         .request(app)
    //         .delete(`/api/url/${req.params.id}`)
    //         .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTVhOWFjMWEwZWEwMDY2N2NmNDgyYSIsInVzZXJuYW1lIjoiYWJoaXNoZWsiLCJwYXNzd29yZCI6IiQyYSQxMCRCVlI5Tlp6UlJKYXgxeVpZM2ZFeDBlcmdOM2dyMzZhWWRrUC93a3JCWFk1QVYxaFRyZjAzZSIsIl9fdiI6MH0sImlhdCI6MTcwMDcyMzA3NCwiZXhwIjoxNzAwNzI2Njc0fQ.E6QbBiZAI2k6BiyigvtJ9I0zUUrpPizzx3jDjuty4cQ'); // Replace with your actual auth token
      
    //       // Assertions
    //       expect(response.status).to.equal(200);
    //       expect(response.body).to.be.an('object');
    //       expect(response.body.msg).to.equal('URL removed');
    //     });
      
    //     it('should handle deleting a nonexistent user URL', async () => {
    //       // Mock data for the request
    //       const req = {
    //         params: { id: '65585bc576f6dc7179501577' }, // Replace with a non-existing ObjectId for testing
    //       };
      
    //       // Simulate no URL found for the user
    //       deleteOneStub.resolves({ n: 0, ok: 1, deletedCount: 0 });
      
    //       // Making the API request
    //       const response = await chai
    //         .request(app)
    //         .delete(`/api/url/${req.params.id}`)
    //         .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY1NTVhOWFjMWEwZWEwMDY2N2NmNDgyYSIsInVzZXJuYW1lIjoiYWJoaXNoZWsiLCJwYXNzd29yZCI6IiQyYSQxMCRCVlI5Tlp6UlJKYXgxeVpZM2ZFeDBlcmdOM2dyMzZhWWRrUC93a3JCWFk1QVYxaFRyZjAzZSIsIl9fdiI6MH0sImlhdCI6MTcwMDcyMzA3NCwiZXhwIjoxNzAwNzI2Njc0fQ.E6QbBiZAI2k6BiyigvtJ9I0zUUrpPizzx3jDjuty4cQ'); // Replace with your actual auth token
      
    //       // Assertions
    //       expect(response.status).to.equal(404);
    //       expect(response.body).to.be.an('object');
    //       expect(response.body.msg).to.equal('URL not found');
    //     });
    //   });