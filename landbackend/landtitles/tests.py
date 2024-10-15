from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError  
from .models import LandTitle  

class LandTitleTests(TestCase):
    
    def setUp(self):
        self.land_title = LandTitle.objects.create(
            land_id='unique_land_id_1',
            owner_name='John Doe',
            owner_email='john@example.com',
            land_location='Location A',
            national_id='AB123456',
            land_size=1000,
            surface_area=500,
            coordinates='12.34,56.78',
            nature = 'empty',
            profession = 'bussinessowner',
            address = 'mfou',
            dob = '2005-06-26',
            pob = 'yaounde',
            father_name = 'Pablo',
            mother_name = 'Miranda',
            delivery_date = '2024-09-20'
                )
    
    def test_land_title_creation(self):
        self.assertIsInstance(self.land_title, LandTitle)
        self.assertEqual(self.land_title.owner_name, 'John Doe')
        self.assertEqual(self.land_title.land_size, 1000)

    def test_land_title_str(self):
        self.assertEqual(str(self.land_title), 'John Doe - unique_land_id_1')

    def test_duplicate_land_id(self):
        with self.assertRaises(IntegrityError):
            LandTitle.objects.create(
                land_id='unique_land_id_1',  
                owner_name='Another Owner',
                owner_email='lamago@gmail.com',
                land_location='Location C',
                national_id='EF987654',
                land_size=2000,
                surface_area=700,
                coordinates='34.56,78.90',
                 nature = 'empty',
                profession = 'bussinessowner',
                address = 'mfou',
                dob = '2005-06-26',
                pob = 'yaounde',
                father_name = 'Pablo',
                mother_name = 'Miranda',
                delivery_date = '2024-09-20'
            )
